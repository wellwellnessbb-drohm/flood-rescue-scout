// Vercel Serverless Function สำหรับ Flood Rescue Scout
// ไฟล์นี้จะถูก deploy เป็น /api/flood-rescue

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// สำหรับ Vercel: ใช้ /tmp directory (writable)
const getDataDir = () => {
  // Vercel ใช้ /tmp สำหรับเขียนไฟล์
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    return '/tmp/flood-rescue-data';
  }
  // Local development
  return path.join(__dirname, '../data');
};

// สร้าง data directory ถ้ายังไม่มี
const ensureDataDir = () => {
  const dataDir = getDataDir();
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return dataDir;
};

// GET: ดึงข้อมูลทั้งหมด
async function handleGet() {
  try {
    const dataDir = ensureDataDir();
    
    // ถ้าไม่มี directory หรือไม่มีไฟล์ ให้ return empty array
    if (!fs.existsSync(dataDir)) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ data: [] })
      };
    }
    
    let files = [];
    try {
      const fileList = fs.readdirSync(dataDir);
      files = fileList
        .filter(f => f.endsWith('.json'))
        .map(f => {
          try {
            const content = fs.readFileSync(path.join(dataDir, f), 'utf8');
            return JSON.parse(content);
          } catch (e) {
            console.error(`Error reading ${f}:`, e);
            return null;
          }
        })
        .filter(Boolean)
        .sort((a, b) => (b.submittedAt || b.submitted_at || 0) - (a.submittedAt || a.submitted_at || 0));
    } catch (readError) {
      console.error('Error reading directory:', readError);
      // Return empty array if can't read
      files = [];
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ data: files })
    };
  } catch (error) {
    console.error('GET handler error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined })
    };
  }
}

// POST: บันทึกข้อมูลใหม่
async function handlePost(event) {
  try {
    // Parse request body
    let data;
    try {
      data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Invalid JSON in request body'
        })
      };
    }
    
    const dataDir = ensureDataDir();
    
    // บันทึกลงไฟล์ JSON
    try {
      const filename = `flood-rescue-${Date.now()}.json`;
      const filepath = path.join(dataDir, filename);
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
      console.log('✅ Saved to:', filepath);
    } catch (writeError) {
      console.error('Error writing JSON file:', writeError);
      // Continue even if JSON write fails
    }
    
    // บันทึกลงไฟล์ CSV (optional, don't fail if this fails)
    try {
      const csvLine = [
        data.id || '',
        `"${(data.location || '').replace(/"/g, '""')}"`,
        `"${(data.contact || '').replace(/"/g, '""')}"`,
        data.severity || '',
        `"${(data.needs || '').replace(/"/g, '""')}"`,
        `"${(data.timestamp_context || '').replace(/"/g, '""')}"`,
        `"${(data.number_of_people || '').replace(/"/g, '""')}"`,
        `"${(data.weather_condition || '').replace(/"/g, '""')}"`,
        `"${(data.additional_info || '').replace(/"/g, '""')}"`,
        data.submitted_at || data.submittedAt || '',
        `"${(data.url || '').replace(/"/g, '""')}"`
      ].join(',') + '\n';
      
      const csvFile = path.join(dataDir, 'flood-rescue-data.csv');
      if (!fs.existsSync(csvFile)) {
        const headers = [
          'ID', 'Location', 'Contact', 'Severity', 'Needs',
          'Time Context', 'Number of People', 'Weather Condition',
          'Additional Info', 'Submitted At', 'URL'
        ].join(',') + '\n';
        fs.writeFileSync(csvFile, '\uFEFF' + headers, 'utf8');
      }
      fs.appendFileSync(csvFile, csvLine, 'utf8');
    } catch (csvError) {
      console.error('Error writing CSV file:', csvError);
      // Don't fail the request if CSV write fails
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: true,
        message: 'Data received and saved',
        id: data.id
      })
    };
  } catch (error) {
    console.error('❌ POST handler error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
}

// Vercel Serverless Function Handler
export default async (req, res) => {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(200).end();
    }

    let result;
    
    if (req.method === 'GET') {
      result = await handleGet();
    } else if (req.method === 'POST') {
      result = await handlePost(req);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Set headers
    if (result.headers) {
      Object.keys(result.headers).forEach(key => {
        res.setHeader(key, result.headers[key]);
      });
    }
    
    // Send response
    const statusCode = result.statusCode || 200;
    const body = typeof result.body === 'string' ? result.body : JSON.stringify(result.body);
    return res.status(statusCode).send(body);
  } catch (error) {
    console.error('Handler error:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

