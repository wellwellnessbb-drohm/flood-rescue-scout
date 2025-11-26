// ตัวอย่าง API Endpoint สำหรับรับข้อมูลจาก Extension
// ใช้ได้กับ Node.js + Express

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json());

// CORS - อนุญาตให้ Extension ส่งข้อมูลมา
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// API Endpoint สำหรับรับข้อมูล
app.post('/api/flood-rescue', (req, res) => {
  try {
    const data = req.body;
    
    console.log('📥 Received flood rescue data:', data);
    
    // วิธีที่ 1: บันทึกลงไฟล์ JSON
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    const filename = `flood-rescue-${Date.now()}.json`;
    const filepath = path.join(dataDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log('✅ Saved to:', filepath);
    
    // วิธีที่ 2: บันทึกลงไฟล์ CSV (ถ้าต้องการ)
    const csvLine = [
      data.id,
      `"${data.location.replace(/"/g, '""')}"`,
      `"${data.contact.replace(/"/g, '""')}"`,
      data.severity,
      `"${data.needs.replace(/"/g, '""')}"`,
      `"${data.timestamp_context.replace(/"/g, '""')}"`,
      `"${data.number_of_people.replace(/"/g, '""')}"`,
      `"${data.weather_condition.replace(/"/g, '""')}"`,
      `"${data.additional_info.replace(/"/g, '""')}"`,
      data.submitted_at,
      `"${data.url.replace(/"/g, '""')}"`
    ].join(',') + '\n';
    
    const csvFile = path.join(dataDir, 'flood-rescue-data.csv');
    if (!fs.existsSync(csvFile)) {
      // สร้าง Header ถ้ายังไม่มีไฟล์
      const headers = [
        'ID', 'Location', 'Contact', 'Severity', 'Needs',
        'Time Context', 'Number of People', 'Weather Condition',
        'Additional Info', 'Submitted At', 'URL'
      ].join(',') + '\n';
      fs.writeFileSync(csvFile, '\uFEFF' + headers); // BOM สำหรับ Excel
    }
    fs.appendFileSync(csvFile, csvLine);
    
    // วิธีที่ 3: ส่งไป Database (ตัวอย่าง)
    // await db.insert('flood_rescue_data', data);
    
    // วิธีที่ 4: ส่ง Email (ตัวอย่าง)
    // await sendEmail({
    //   to: 'rescue@example.com',
    //   subject: `Flood Rescue Alert: ${data.severity}`,
    //   body: JSON.stringify(data, null, 2)
    // });
    
    res.json({
      success: true,
      message: 'Data received and saved',
      id: data.id
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API สำหรับดูข้อมูลทั้งหมด
app.get('/api/flood-rescue', (req, res) => {
  try {
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      return res.json({ data: [] });
    }
    
    const files = fs.readdirSync(dataDir)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        const content = fs.readFileSync(path.join(dataDir, f), 'utf8');
        return JSON.parse(content);
      })
      .sort((a, b) => (b.submittedAt || b.submitted_at || 0) - (a.submittedAt || a.submitted_at || 0)); // เรียงตามเวลาล่าสุด
    
    res.json({ data: files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve dashboard HTML
app.get('/', (req, res) => {
  const dashboardPath = path.join(__dirname, 'dashboard.html');
  if (fs.existsSync(dashboardPath)) {
    res.sendFile(dashboardPath);
  } else {
    res.send(`
      <html>
        <head><title>Flood Rescue Scout API</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1>🚨 Flood Rescue Scout API</h1>
          <p>API is running!</p>
          <p>Endpoint: <a href="/api/flood-rescue">/api/flood-rescue</a></p>
          <p>Dashboard: <a href="/dashboard.html">/dashboard.html</a></p>
        </body>
      </html>
    `);
  }
});

app.get('/dashboard.html', (req, res) => {
  const dashboardPath = path.join(__dirname, 'dashboard.html');
  if (fs.existsSync(dashboardPath)) {
    res.sendFile(dashboardPath);
  } else {
    res.status(404).send('Dashboard not found');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/flood-rescue`);
});

