# วิธีตั้งค่า Google Sheets - ขั้นตอนละเอียด

## ขั้นตอนที่ 1: สร้าง Google Apps Script

1. ไปที่ [Google Apps Script](https://script.google.com/)
2. คลิก "โครงการใหม่" (New Project)
3. วางโค้ดต่อไปนี้ในไฟล์ `รหัส.gs`:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const spreadsheetId = data.spreadsheetId;
    const sheetName = data.sheetName || 'Sheet1';
    const rowData = data.data;
    
    // เปิด Spreadsheet
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    let sheet = spreadsheet.getSheetByName(sheetName);
    
    // ถ้ายังไม่มี Sheet ให้สร้างใหม่
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }
    
    // ถ้า Sheet ยังว่าง ให้เพิ่ม Header
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Location', 'Contact', 'Severity', 'Needs', 
        'Time Context', 'Number of People', 'Weather Condition',
        'Additional Info', 'Submitted At', 'URL'
      ];
      sheet.appendRow(headers);
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
    }
    
    // เพิ่มข้อมูลใหม่
    const newRow = [
      rowData.location || '',
      rowData.contact || '',
      rowData.severity || '',
      rowData.needs || '',
      rowData.timestamp_context || '',
      rowData.number_of_people || '',
      rowData.weather_condition || '',
      rowData.additional_info || '',
      rowData.submitted_at || '',
      rowData.url || ''
    ];
    
    sheet.appendRow(newRow);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data added successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Flood Rescue Scout - Google Sheets Web App')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

4. คลิก "บันทึก" (Save) หรือกด `Ctrl+S`
5. ตั้งชื่อโปรเจกต์ (เช่น "Flood Rescue Scout")

## ขั้นตอนที่ 2: Deploy เป็น Web App (แก้ปัญหาติดที่การให้สิทธิ์)

### วิธีที่ 1: Deploy ผ่าน UI (แนะนำ)

1. **คลิก "การทำให้ใช้งานได้" (Deploy)** → **"การทำให้ใช้งานได้รายการใหม่" (New deployment)**

2. **ในหน้าต่าง Deploy:**
   - คลิกไอคอน **⚙️ (Settings)** ข้างๆ "Select type"
   - เลือก **"Web app"**

3. **ตั้งค่า:**
   - **Description:** (ไม่บังคับ) เช่น "Flood Rescue Scout API"
   - **Execute as:** เลือก **"Me"** (ตัวคุณเอง)
   - **Who has access:** เลือก **"Anyone"** (ใครก็ได้)

4. **คลิก "Deploy"**

5. **หน้าต่าง "ให้สิทธิ์เข้าถึง" (Authorization) จะปรากฏ:**
   - คลิก **"ให้สิทธิ์เข้าถึง" (Grant Access)**
   - เลือกบัญชี Google ของคุณ
   - จะมีข้อความเตือน "Google hasn't verified this app" → คลิก **"Advanced"** → **"Go to [ชื่อโปรเจกต์] (unsafe)"**
   - คลิก **"Allow"** เพื่อให้สิทธิ์

6. **หลังจากให้สิทธิ์แล้ว:**
   - จะเห็นหน้าต่าง "Web app deployed"
   - **คัดลอก "Web app URL"** (URL ที่ขึ้นต้นด้วย `https://script.google.com/macros/s/...`)
   - คลิก **"เสร็จสิ้น" (Done)**

### วิธีที่ 2: ถ้ายังติด ให้ลองวิธีนี้

1. **เพิ่มฟังก์ชันทดสอบก่อน:**
   - เพิ่มโค้ดนี้ใน Apps Script:
   ```javascript
   function testConnection() {
     Logger.log('Test connection');
     return 'OK';
   }
   ```

2. **Run ฟังก์ชันทดสอบ:**
   - เลือกฟังก์ชัน `testConnection` จาก dropdown
   - คลิก "Run" (▶️)
   - ให้สิทธิ์เมื่อถูกถาม (จะถามครั้งแรก)

3. **หลังจากให้สิทธิ์แล้ว:**
   - กลับไป Deploy Web App ตามขั้นตอนที่ 1
   - ควรจะไม่ติดแล้ว

## ขั้นตอนที่ 3: สร้าง Google Sheets

1. ไปที่ [Google Sheets](https://sheets.google.com/)
2. สร้าง Spreadsheet ใหม่
3. **คัดลอก Spreadsheet ID จาก URL:**
   - URL จะเป็น: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - คัดลอกส่วน `SPREADSHEET_ID` (ตัวอักษรยาวๆ ระหว่าง `/d/` และ `/edit`)

## ขั้นตอนที่ 4: ตั้งค่าใน Extension

1. **เปิด Extension Console:**
   - เปิด Extension "Flood Rescue Scout"
   - กด `F12` หรือคลิกขวา → "Inspect"
   - ไปที่แท็บ "Console"

2. **ตั้งค่า Google Sheets:**
   ```javascript
   chrome.storage.local.set({
     googleSheetsConfig: {
       spreadsheetId: 'YOUR_SPREADSHEET_ID',  // ใส่ Spreadsheet ID ที่คัดลอกมา
       sheetName: 'Sheet1'  // หรือชื่อ Sheet ที่ต้องการ
     },
     googleSheetsWebAppUrl: 'YOUR_WEB_APP_URL'  // ใส่ Web App URL ที่ได้จาก Deploy
   }, () => {
     console.log('✅ Google Sheets configured!');
   });
   ```

3. **ทดสอบการเชื่อมต่อ:**
   ```javascript
   chrome.storage.local.get(['googleSheetsConfig', 'googleSheetsWebAppUrl'], (result) => {
     console.log('Config:', result);
   });
   ```

## ขั้นตอนที่ 5: ทดสอบ

1. เปิด Facebook post
2. คลิก "Analyze Page" ใน Extension
3. กรอกข้อมูลและคลิก "Submit Data"
4. ตรวจสอบ Google Sheets ว่ามีข้อมูลเพิ่มเข้ามาหรือไม่

## แก้ปัญหา

### ถ้ายังติดที่การให้สิทธิ์:
- ลองปิด Apps Script แล้วเปิดใหม่
- ลองใช้บัญชี Google อื่น
- ตรวจสอบว่าเปิด "Less secure app access" หรือไม่ (ไม่จำเป็นสำหรับ Apps Script)

### ถ้า Deploy แล้วแต่ส่งข้อมูลไม่ได้:
- ตรวจสอบว่า Web App URL ถูกต้อง
- ตรวจสอบว่า Spreadsheet ID ถูกต้อง
- ดู Console ใน Extension ว่ามี error อะไร
- ดู Execution log ใน Apps Script (View → Execution log)

### ถ้าเห็น "Script function not found":
- ตรวจสอบว่าชื่อฟังก์ชัน `doPost` ถูกต้อง
- ตรวจสอบว่า Deploy เป็น Web app (ไม่ใช่ API executable)


