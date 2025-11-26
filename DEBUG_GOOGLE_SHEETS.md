# วิธี Debug Google Sheets Integration

## ปัญหา: ข้อมูลไม่เข้า Google Sheets

### ขั้นตอนการ Debug:

#### 1. Reload Extension
- ไปที่ `chrome://extensions/`
- คลิก Reload ที่ "Flood Rescue Scout"

#### 2. ตรวจสอบ Configuration
เปิด Console (F12) ใน Extension และรัน:

```javascript
chrome.storage.local.get(['googleSheetsConfig', 'googleSheetsWebAppUrl'], (result) => {
  console.log('📋 Current Configuration:');
  console.log('Spreadsheet ID:', result.googleSheetsConfig?.spreadsheetId);
  console.log('Sheet Name:', result.googleSheetsConfig?.sheetName);
  console.log('Web App URL:', result.googleSheetsWebAppUrl);
  
  if (!result.googleSheetsConfig) {
    console.error('❌ googleSheetsConfig is missing!');
  }
  if (!result.googleSheetsWebAppUrl) {
    console.error('❌ googleSheetsWebAppUrl is missing!');
  }
  if (result.googleSheetsConfig && result.googleSheetsWebAppUrl) {
    console.log('✅ Configuration is set correctly!');
  }
});
```

#### 3. ทดสอบ Submit ข้อมูล
1. เปิด Facebook post
2. คลิก "Analyze Page"
3. กรอกข้อมูล
4. คลิก "Submit Data"
5. **ดู Console ว่ามีข้อความอะไร:**
   - `🔄 Attempting to sync to Google Sheets...` - เริ่ม sync
   - `📋 Config:` - แสดง config ที่ใช้
   - `📤 Sending data to Google Sheets...` - ส่งข้อมูล
   - `📥 Response status:` - Status code จาก Google Apps Script
   - `✅ Synced to Google Sheets successfully!` - สำเร็จ
   - `❌ Failed to sync...` - ล้มเหลว (ดู error message)

#### 4. ตรวจสอบ Google Apps Script
1. ไปที่ [Google Apps Script](https://script.google.com/)
2. เปิดโปรเจกต์ของคุณ
3. ไปที่ "การดำเนินการ" (Executions) ในเมนูซ้าย
4. ดู Execution log ว่ามี error หรือไม่

#### 5. ทดสอบ Google Apps Script โดยตรง
เปิด Browser ใหม่และไปที่ Web App URL:
```
https://script.google.com/macros/s/YOUR_WEB_APP_ID/exec
```

ควรเห็นข้อความ: `Flood Rescue Scout - Google Sheets Web App`

#### 6. ทดสอบ POST Request
เปิด Console และรัน:

```javascript
fetch('YOUR_WEB_APP_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    spreadsheetId: 'YOUR_SPREADSHEET_ID',
    sheetName: 'Sheet1',
    data: {
      location: 'Test Location',
      contact: 'Test Contact',
      severity: 'Normal',
      needs: 'Test Needs',
      timestamp_context: 'Test Time',
      number_of_people: '5',
      weather_condition: 'Rain',
      additional_info: 'Test Info',
      submitted_at: new Date().toISOString(),
      url: 'https://test.com'
    }
  })
})
.then(r => r.text())
.then(console.log)
.catch(console.error);
```

## ปัญหาที่พบบ่อย:

### 1. "Google Sheets config not found"
**แก้ไข:** ตั้งค่า config อีกครั้ง:
```javascript
chrome.storage.local.set({
  googleSheetsConfig: {
    spreadsheetId: 'YOUR_SPREADSHEET_ID',
    sheetName: 'Sheet1'
  },
  googleSheetsWebAppUrl: 'YOUR_WEB_APP_URL/exec'
});
```

### 2. "CORS error" หรือ "Failed to fetch"
**แก้ไข:** 
- ตรวจสอบว่า Web App URL มี `/exec` ต่อท้าย
- ตรวจสอบว่า Deploy เป็น "Web app" (ไม่ใช่ API executable)
- ตรวจสอบว่า "Who has access" เป็น "Anyone"

### 3. "Script function not found"
**แก้ไข:**
- ตรวจสอบว่า Google Apps Script มีฟังก์ชัน `doPost`
- ตรวจสอบว่า Deploy เป็น Web app
- ลอง Deploy ใหม่

### 4. ข้อมูลไม่เข้า Sheets แต่ไม่มี Error
**แก้ไข:**
- ตรวจสอบ Spreadsheet ID ว่าถูกต้อง
- ตรวจสอบ Sheet Name ว่าถูกต้อง (ถ้า Sheet ไม่มี จะสร้างใหม่)
- ตรวจสอบ Execution log ใน Apps Script

### 5. "Permission denied" ใน Apps Script
**แก้ไข:**
- ตรวจสอบว่าให้สิทธิ์ Apps Script เข้าถึง Google Sheets แล้ว
- ตรวจสอบว่า Spreadsheet แชร์ให้บัญชีที่ใช้ Apps Script หรือไม่

## ตรวจสอบข้อมูลใน Google Sheets:

1. เปิด Google Sheets
2. ตรวจสอบว่า:
   - มี Header row หรือไม่ (ถ้าไม่มี แสดงว่า Script ไม่ทำงาน)
   - มีข้อมูลเพิ่มเข้ามาหรือไม่
   - ข้อมูลถูกต้องหรือไม่

## หมายเหตุ:

- Google Apps Script มี quota limit (100 requests/100 seconds)
- ถ้ามีข้อมูลเยอะ อาจต้องรอสักครู่
- Web App URL จะเปลี่ยนทุกครั้งที่ Deploy ใหม่


