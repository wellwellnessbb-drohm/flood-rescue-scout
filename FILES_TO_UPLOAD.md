# 📦 ไฟล์ที่ต้อง Upload ไปยัง HostAtom

## สำหรับ dr9ohm.com/flood-rescue/

---

## 🎯 วิธีที่ 1: ใช้ Vercel สำหรับ API (แนะนำ - ง่ายที่สุด)

### ไฟล์ที่ต้อง Upload:

**ไปยัง `/public_html/flood-rescue/` (หรือ `/www/flood-rescue/`):**

1. ✅ `dashboard-static.html` 
   - **เปลี่ยนชื่อเป็น:** `index.html`
   - **Permissions:** 644

### ไฟล์ที่ต้อง Deploy แยก (Vercel):

1. ✅ `api-example.js`
2. ✅ `package.json`

---

## 🎯 วิธีที่ 2: Deploy ทั้งหมดบน HostAtom (ถ้ารองรับ Node.js)

### ไฟล์ที่ต้อง Upload:

**ไปยัง `/public_html/flood-rescue/`:**

1. ✅ `dashboard-static.html` → เปลี่ยนชื่อเป็น `index.html`
2. ✅ `.htaccess` (ถ้าใช้ Apache)

**ไปยัง Node.js App Root (ถ้าใช้ Node.js Selector):**

1. ✅ `api-example.js`
2. ✅ `package.json`

---

## 📝 ขั้นตอน Upload:

### ใช้ cPanel File Manager:

1. Login เข้า cPanel
2. ไปที่ **File Manager**
3. ไปยัง `/public_html/`
4. สร้างโฟลเดอร์ `flood-rescue`
5. Upload ไฟล์ `dashboard-static.html`
6. Rename เป็น `index.html`
7. ตั้งค่า Permissions: `644`

### ใช้ FTP:

1. Connect ไปยัง `ftp.dr9ohm.com`
2. ไปยัง `/public_html/flood-rescue/`
3. Upload `dashboard-static.html`
4. Rename เป็น `index.html`

---

## ✅ หลังจาก Upload:

1. เปิด `https://dr9ohm.com/flood-rescue/`
2. ตั้งค่า API URL (ถ้าใช้ Vercel)
3. ทดสอบ Dashboard

