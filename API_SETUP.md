# วิธีตั้งค่า API Endpoint (ง่ายกว่า Google Sheets!)

## วิธีที่ 1: ใช้ API Endpoint (แนะนำ - ง่ายที่สุด)

### ขั้นตอน:

#### 1. สร้าง API Endpoint
คุณสามารถใช้:
- **Backend API** (Node.js, Python, PHP, etc.)
- **Serverless Function** (Vercel, Netlify, AWS Lambda)
- **Webhook** (Zapier, Make.com, etc.)
- **Database API** (Firebase, Supabase, etc.)

#### 2. ตั้งค่าใน Extension
1. เปิด Extension popup
2. คลิกปุ่ม **"🔗 ตั้งค่า API"** (ในส่วน Submitted Data Summary)
3. ใส่ API Endpoint URL เช่น:
   - `https://your-api.com/api/flood-rescue`
   - `https://your-backend.vercel.app/api/submit`
   - `https://your-webhook-url.com/webhook`

#### 3. API จะรับข้อมูลในรูปแบบ:
```json
{
  "location": "...",
  "contact": "...",
  "severity": "Critical|High|Normal",
  "needs": "...",
  "timestamp_context": "...",
  "number_of_people": "...",
  "weather_condition": "...",
  "additional_info": "...",
  "submitted_at": "2025-11-26T12:30:00.000Z",
  "url": "https://facebook.com/...",
  "id": "unique-id"
}
```

#### 4. ตัวอย่าง API Endpoint (Node.js/Express)
```javascript
app.post('/api/flood-rescue', (req, res) => {
  const data = req.body;
  
  // บันทึกลง Database
  // หรือส่งไปที่อื่น
  // หรือบันทึกลงไฟล์
  
  console.log('Received data:', data);
  
  res.json({ success: true, message: 'Data received' });
});
```

#### 5. ตัวอย่าง API Endpoint (Python/Flask)
```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/flood-rescue', methods=['POST'])
def receive_data():
    data = request.json
    
    # บันทึกลง Database
    # หรือส่งไปที่อื่น
    
    print('Received data:', data)
    
    return jsonify({'success': True, 'message': 'Data received'})
```

## วิธีที่ 2: ใช้ Export JSON/CSV (ไม่ต้องตั้งค่า)

### ขั้นตอน:
1. Submit ข้อมูลใน Extension
2. คลิก **"📥 Export JSON"** หรือ **"📊 Export CSV"**
3. ไฟล์จะดาวน์โหลดอัตโนมัติ
4. เปิดไฟล์ใน Excel, Google Sheets, หรือโปรแกรมอื่น

**ข้อดี:**
- ไม่ต้องตั้งค่าอะไร
- ใช้งานได้ทันที
- ข้อมูลอยู่ในเครื่องคุณ

**ข้อเสีย:**
- ต้อง Export เองทุกครั้ง
- ไม่ได้ sync อัตโนมัติ

## วิธีที่ 3: ใช้ Webhook Services (ง่ายมาก)

### ตัวอย่าง: Zapier Webhook
1. สร้าง Zapier account
2. สร้าง Zap ใหม่ → Webhook by Zapier → Catch Hook
3. คัดลอก Webhook URL
4. ตั้งค่าใน Extension (ใส่ Webhook URL)
5. ข้อมูลจะถูกส่งไป Zapier อัตโนมัติ
6. จาก Zapier สามารถส่งไป:
   - Google Sheets
   - Database
   - Email
   - Slack
   - อื่นๆ

### ตัวอย่าง: Make.com (Integromat)
1. สร้าง Scenario ใหม่
2. เพิ่ม Webhook module
3. คัดลอก Webhook URL
4. ตั้งค่าใน Extension
5. ข้อมูลจะถูกส่งไป Make.com
6. จาก Make.com สามารถส่งไปที่ไหนก็ได้

## เปรียบเทียบ:

| วิธี | ความยาก | ต้องตั้งค่า | Auto-sync |
|------|---------|------------|-----------|
| **API Endpoint** | ⭐⭐ | ต้องมี API | ✅ |
| **Export JSON/CSV** | ⭐ | ไม่ต้อง | ❌ |
| **Webhook (Zapier/Make)** | ⭐⭐ | ต้องสมัคร | ✅ |
| **Google Sheets** | ⭐⭐⭐ | ซับซ้อน | ✅ |

## คำแนะนำ:

- **ถ้าต้องการง่ายที่สุด:** ใช้ Export JSON/CSV
- **ถ้าต้องการ Auto-sync:** ใช้ API Endpoint หรือ Webhook
- **ถ้ามี Backend อยู่แล้ว:** ใช้ API Endpoint
- **ถ้าไม่มี Backend:** ใช้ Webhook (Zapier/Make.com)

