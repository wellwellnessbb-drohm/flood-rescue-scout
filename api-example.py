# ตัวอย่าง API Endpoint สำหรับรับข้อมูลจาก Extension
# ใช้ได้กับ Python + Flask

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # อนุญาตให้ Extension ส่งข้อมูลมา

# สร้างโฟลเดอร์ data ถ้ายังไม่มี
DATA_DIR = 'data'
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

@app.route('/api/flood-rescue', methods=['POST', 'OPTIONS'])
def receive_data():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.json
        print(f'📥 Received flood rescue data: {data}')
        
        # วิธีที่ 1: บันทึกลงไฟล์ JSON
        filename = f"flood-rescue-{int(datetime.now().timestamp() * 1000)}.json"
        filepath = os.path.join(DATA_DIR, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f'✅ Saved to: {filepath}')
        
        # วิธีที่ 2: บันทึกลงไฟล์ CSV
        csv_file = os.path.join(DATA_DIR, 'flood-rescue-data.csv')
        csv_exists = os.path.exists(csv_file)
        
        with open(csv_file, 'a', encoding='utf-8-sig') as f:  # utf-8-sig สำหรับ Excel
            if not csv_exists:
                # สร้าง Header ถ้ายังไม่มีไฟล์
                headers = [
                    'ID', 'Location', 'Contact', 'Severity', 'Needs',
                    'Time Context', 'Number of People', 'Weather Condition',
                    'Additional Info', 'Submitted At', 'URL'
                ]
                f.write(','.join(headers) + '\n')
            
            # เพิ่มข้อมูลใหม่
            row = [
                data.get('id', ''),
                f'"{data.get("location", "").replace('"', '""')}"',
                f'"{data.get("contact", "").replace('"', '""')}"',
                data.get('severity', ''),
                f'"{data.get("needs", "").replace('"', '""')}"',
                f'"{data.get("timestamp_context", "").replace('"', '""')}"',
                f'"{data.get("number_of_people", "").replace('"', '""')}"',
                f'"{data.get("weather_condition", "").replace('"', '""')}"',
                f'"{data.get("additional_info", "").replace('"', '""')}"',
                data.get('submitted_at', ''),
                f'"{data.get("url", "").replace('"', '""')}"'
            ]
            f.write(','.join(row) + '\n')
        
        # วิธีที่ 3: ส่งไป Database (ตัวอย่าง)
        # db.insert('flood_rescue_data', data)
        
        # วิธีที่ 4: ส่ง Email (ตัวอย่าง)
        # send_email(
        #     to='rescue@example.com',
        #     subject=f'Flood Rescue Alert: {data.get("severity")}',
        #     body=json.dumps(data, indent=2, ensure_ascii=False)
        # )
        
        return jsonify({
            'success': True,
            'message': 'Data received and saved',
            'id': data.get('id')
        })
        
    except Exception as e:
        print(f'❌ Error: {e}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/flood-rescue', methods=['GET'])
def get_all_data():
    try:
        files = []
        if os.path.exists(DATA_DIR):
            for filename in os.listdir(DATA_DIR):
                if filename.endswith('.json'):
                    filepath = os.path.join(DATA_DIR, filename)
                    with open(filepath, 'r', encoding='utf-8') as f:
                        files.append(json.load(f))
        
        return jsonify({'data': files})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    print(f'🚀 Server running on http://localhost:{port}')
    print(f'📡 API endpoint: http://localhost:{port}/api/flood-rescue')
    app.run(host='0.0.0.0', port=port, debug=True)

