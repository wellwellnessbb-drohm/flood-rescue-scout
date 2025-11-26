// Root handler for Vercel
// Serve index.html at root path

const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Only handle GET requests for root
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read index.html
    const indexPath = path.join(__dirname, '../index.html');
    const html = fs.readFileSync(indexPath, 'utf8');
    
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  } catch (error) {
    console.error('Error serving index.html:', error);
    return res.status(500).send(`
      <html>
        <head><title>Flood Rescue Scout API</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1>🚨 Flood Rescue Scout API</h1>
          <p>API is running!</p>
          <p><strong>API Endpoint:</strong> <a href="/api/flood-rescue">/api/flood-rescue</a></p>
          <p style="color: #666; margin-top: 40px;">Error loading index.html: ${error.message}</p>
        </body>
      </html>
    `);
  }
};

