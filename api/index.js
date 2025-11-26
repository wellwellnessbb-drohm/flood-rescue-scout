// Root handler for Vercel
// Serve index.html at root path

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (req, res) => {
  // Only handle GET requests for root
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Try to read dashboard-static.html first, then index.html, then fallback to inline HTML
    let html;
    try {
      // Try dashboard-static.html first (Dashboard)
      const dashboardPath = path.join(__dirname, '../dashboard-static.html');
      html = fs.readFileSync(dashboardPath, 'utf8');
      console.log('✅ Serving dashboard-static.html');
    } catch (dashboardError) {
      try {
        // Fallback to index.html
        const indexPath = path.join(__dirname, '../index.html');
        html = fs.readFileSync(indexPath, 'utf8');
        console.log('✅ Serving index.html');
      } catch (indexError) {
        // If can't read file, serve inline HTML
        console.warn('Could not read dashboard-static.html or index.html, serving inline HTML');
        html = getInlineHTML();
      }
    }
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(html);
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(getInlineHTML());
  }
};

function getInlineHTML() {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'https://2025-flood-rescue-scout.vercel.app';
  
  return `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flood Rescue Scout API</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            background: white;
            color: #333;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #e53e3e;
            margin-top: 0;
        }
        .endpoint {
            background: #f7fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
        }
        .method {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
            margin-right: 10px;
        }
        .get { background: #48bb78; color: white; }
        .post { background: #4299e1; color: white; }
        code {
            background: #2d3748;
            color: #68d391;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
        }
        a {
            color: #667eea;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .test-btn {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            margin-top: 10px;
            cursor: pointer;
            border: none;
            font-size: 14px;
        }
        .test-btn:hover {
            background: #5568d3;
        }
        #result {
            margin-top: 10px;
            padding: 10px;
            background: #f0f0f0;
            border-radius: 4px;
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚨 Flood Rescue Scout API</h1>
        <p>API is running successfully!</p>
        
        <div class="endpoint">
            <span class="method get">GET</span>
            <strong>Get all data:</strong>
            <div style="margin-top: 10px;">
                <code id="getUrl">${baseUrl}/api/flood-rescue</code>
                <button class="test-btn" onclick="testGet()">Test</button>
            </div>
            <div id="result"></div>
        </div>

        <div class="endpoint">
            <span class="method post">POST</span>
            <strong>Submit new data:</strong>
            <div style="margin-top: 10px;">
                <code>${baseUrl}/api/flood-rescue</code>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 10px;">
                Use this endpoint from the Extension or Dashboard.
            </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <h3>📚 Documentation:</h3>
            <ul>
                <li><a href="/api/flood-rescue" target="_blank">GET /api/flood-rescue</a> - Get all submitted data</li>
                <li><strong>POST /api/flood-rescue</strong> - Submit new flood rescue data</li>
            </ul>
        </div>
    </div>

    <script>
        async function testGet() {
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = 'Loading...';
            
            try {
                const response = await fetch('/api/flood-rescue');
                const data = await response.json();
                resultDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (error) {
                resultDiv.innerHTML = 'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>`;
}

