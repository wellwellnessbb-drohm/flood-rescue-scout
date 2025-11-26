# วิธีตั้งค่า Google Sheets - ขั้นตอนละเอียด

## ⚠️ สำคัญ: ต้องรันโค้ดใน Console ของ Extension Popup

### ขั้นตอนที่ถูกต้อง:

#### 1. เปิด Extension Popup
1. คลิกไอคอน Extension "Flood Rescue Scout" ใน Chrome toolbar
2. Extension popup จะเปิดขึ้นมา

#### 2. เปิด Developer Tools ของ Extension Popup
**วิธีที่ 1:**
- คลิกขวาใน Extension popup (คลิกที่พื้นที่ว่างใน popup)
- เลือก "Inspect" หรือ "ตรวจสอบ"

**วิธีที่ 2:**
- กด `F12` ขณะที่ Extension popup เปิดอยู่
- หรือกด `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)

**วิธีที่ 3:**
- ไปที่ `chrome://extensions/`
- เปิด "Flood Rescue Scout"
- คลิก "service worker" หรือ "Inspect views: popup.html"
- จะเปิด Developer Tools ของ Extension

#### 3. ตรวจสอบว่าเปิด Console ถูกที่
- ดูที่ title bar ของ Developer Tools
- ควรเห็น "chrome-extension://..." หรือ "Extension: Flood Rescue Scout"
- ❌ **ไม่ใช่** "facebook.com" หรือ "https://www.facebook.com"

#### 4. ไปที่แท็บ "Console"
- คลิกแท็บ "Console" ใน Developer Tools

#### 5. ตั้งค่า Google Sheets
วางโค้ดนี้ใน Console (แก้ไข Spreadsheet ID และ Web App URL):

```javascript
chrome.storage.local.set({
  googleSheetsConfig: {
    spreadsheetId: 'YOUR_SPREADSHEET_ID',  // ใส่ Spreadsheet ID ที่คัดลอกมา
    sheetName: 'Sheet1'  // หรือชื่อ Sheet ที่ต้องการ
  },
  googleSheetsWebAppUrl: 'https://script.google.com/macros/s/YOUR_WEB_APP_ID/exec'  // ใส่ Web App URL + /exec
}, () => {
  console.log('✅ Google Sheets configured!');
  alert('✅ ตั้งค่า Google Sheets สำเร็จ!');
});
```

#### 6. ตรวจสอบว่าตั้งค่าสำเร็จ
รันโค้ดนี้ใน Console:

```javascript
chrome.storage.local.get(['googleSheetsConfig', 'googleSheetsWebAppUrl'], (result) => {
  console.log('📋 Configuration:');
  console.log('Spreadsheet ID:', result.googleSheetsConfig?.spreadsheetId);
  console.log('Sheet Name:', result.googleSheetsConfig?.sheetName);
  console.log('Web App URL:', result.googleSheetsWebAppUrl);
  
  if (result.googleSheetsConfig && result.googleSheetsWebAppUrl) {
    console.log('✅ Configuration is set correctly!');
  } else {
    console.error('❌ Configuration is missing!');
  }
});
```

## ตัวอย่างโค้ดที่พร้อมใช้:

```javascript
// แทนที่ YOUR_SPREADSHEET_ID และ YOUR_WEB_APP_ID ด้วยค่าจริงของคุณ

chrome.storage.local.set({
  googleSheetsConfig: {
    spreadsheetId: '1zfp1LX1TGVetEr0SyrGvPF-1--WzI9COASaGGkMgiFo',  // ตัวอย่าง Spreadsheet ID
    sheetName: 'Sheet1'
  },
  googleSheetsWebAppUrl: 'https://script.google.com/macros/s/AKfycbzexqvfnfEmmfKSqkMzqNpzx6rINFZTK53WMbp0EIHFDckXalivvltHF7GS28BY9IGotg/exec'
}, () => {
  console.log('✅ Google Sheets configured!');
  alert('✅ ตั้งค่า Google Sheets สำเร็จ!');
});
```

## วิธีหา Spreadsheet ID:

1. เปิด Google Sheets
2. ดู URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. คัดลอกส่วน `SPREADSHEET_ID` (ตัวอักษรยาวๆ ระหว่าง `/d/` และ `/edit`)

## วิธีหา Web App URL:

1. ไปที่ Google Apps Script
2. คลิก "Deploy" → "Manage deployments"
3. คัดลอก "Web app URL"
4. **สำคัญ:** ต้องมี `/exec` ต่อท้าย URL

## หลังจากตั้งค่าเสร็จ:

1. **ปิดและเปิด Extension popup ใหม่** (เพื่อให้โหลด config)
2. ทดสอบ Submit ข้อมูล
3. ดู Console ว่ามีข้อความ:
   - `🔄 Attempting to sync to Google Sheets...`
   - `✅ Synced to Google Sheets successfully!`
4. ตรวจสอบ Google Sheets ว่ามีข้อมูลเพิ่มเข้ามาหรือไม่

## แก้ปัญหา Error:

### Error: "Cannot read properties of undefined (reading 'local')"
**สาเหตุ:** รันโค้ดใน Console ของ Facebook page แทนที่จะเป็น Extension popup

**แก้ไข:** 
- เปิด Developer Tools ของ Extension popup (ไม่ใช่ Facebook page)
- รันโค้ดใน Console ของ Extension popup

### วิธีตรวจสอบว่าเปิด Console ถูกที่:
- ดูที่ title bar ของ Developer Tools
- ควรเห็น "chrome-extension://..." 
- ❌ **ไม่ใช่** "facebook.com"

