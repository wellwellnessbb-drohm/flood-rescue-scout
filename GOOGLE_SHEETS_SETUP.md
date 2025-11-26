# Google Sheets Integration Setup

## วิธีตั้งค่า Google Sheets Auto-Sync

### 1. สร้าง Google Apps Script

1. ไปที่ [Google Apps Script](https://script.google.com/)
2. สร้างโปรเจกต์ใหม่
3. วางโค้ดต่อไปนี้:

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

### 2. Deploy เป็น Web App

1. คลิก "Deploy" → "New deployment"
2. เลือก Type: "Web app"
3. ตั้งค่า:
   - Execute as: "Me"
   - Who has access: "Anyone"
4. คลิก "Deploy"
5. คัดลอก Web App URL ที่ได้

### 3. ตั้งค่าใน Extension

1. เปิด Extension → ดู Console (F12)
2. ตั้งค่า Google Sheets:

```javascript
// ตั้งค่า Spreadsheet ID และ Sheet Name
chrome.storage.local.set({
  googleSheetsConfig: {
    spreadsheetId: 'YOUR_SPREADSHEET_ID',
    sheetName: 'Sheet1'
  },
  googleSheetsWebAppUrl: 'YOUR_WEB_APP_URL'
});
```

**วิธีหา Spreadsheet ID:**
- เปิด Google Sheets
- ดู URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
- คัดลอก `SPREADSHEET_ID` ส่วนนั้น

### 4. ทดสอบ

1. Submit ข้อมูลใน Extension
2. ตรวจสอบ Google Sheets ว่ามีข้อมูลเพิ่มเข้ามาหรือไม่

## หมายเหตุ

- Google Apps Script มี quota limit (100 requests/100 seconds per user)
- ถ้ามีข้อมูลเยอะมาก อาจต้องเพิ่ม delay ระหว่าง requests
- Web App URL จะเปลี่ยนทุกครั้งที่ Deploy ใหม่ (ต้องอัปเดตใน Extension)


