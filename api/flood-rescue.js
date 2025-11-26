// Vercel Serverless Function สำหรับ Flood Rescue Scout
// ไฟล์นี้จะถูก deploy เป็น /api/flood-rescue

const fs = require('fs');
const path = require('path');

// สำหรับ Vercel: ใช้ /tmp directory (writable)
const getDataDir = () => {
  // Vercel ใช้ /tmp สำหรับเขียนไฟล์
  if (process.env.VERCEL) {
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
    if (!fs.existsSync(dataDir)) {
      return { statusCode: 200, body: JSON.stringify({ data: [] }) };
    }
    
    const files = fs.readdirSync(dataDir)
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
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
}

// POST: บันทึกข้อมูลใหม่
async function handlePost(event) {
  try {
    const data = JSON.parse(event.body);
    const dataDir = ensureDataDir();
    
    // บันทึกลงไฟล์ JSON
    const filename = `flood-rescue-${Date.now()}.json`;
    const filepath = path.join(dataDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log('✅ Saved to:', filepath);
    
    // บันทึกลงไฟล์ CSV
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
      fs.writeFileSync(csvFile, '\uFEFF' + headers);
    }
    fs.appendFileSync(csvFile, csvLine);
    
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
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
}

// Vercel Serverless Function Handler
module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  try {
    let result;
    
    if (req.method === 'GET') {
      result = await handleGet();
    } else if (req.method === 'POST') {
      result = await handlePost(req);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Set headers
    Object.keys(result.headers || {}).forEach(key => {
      res.setHeader(key, result.headers[key]);
    });
    
    return res.status(result.statusCode).send(result.body);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: error.message });
  }
};

