# 🚀 Deploy Dashboard ไปยัง dr9ohm.com

## 🎯 ตัวเลือกการ Deploy:

### ตัวเลือกที่ 1: ใช้ Subdomain (แนะนำ)
**URL:** `https://flood-rescue.dr9ohm.com`

**ข้อดี:**
- ✅ แยกจากเว็บหลัก
- ✅ ตั้งค่าค่อนข้างง่าย
- ✅ ดูเป็นระบบแยก

### ตัวเลือกที่ 2: ใช้ Path
**URL:** `https://dr9ohm.com/flood-rescue/`

**ข้อดี:**
- ✅ ไม่ต้องตั้งค่า subdomain
- ✅ ใช้โดเมนเดิม

---

## 📋 ขั้นตอนการ Deploy:

### วิธีที่ 1: ใช้ Subdomain (flood-rescue.dr9ohm.com)

#### ขั้นตอน:

1. **สร้าง Subdomain:**
   - ไปที่ cPanel → Subdomains
   - สร้าง subdomain: `flood-rescue`
   - Document Root: `/public_html/flood-rescue` (หรือตามที่ต้องการ)
   - คลิก "Create"

2. **Upload ไฟล์:**
   - ใช้ FTP หรือ cPanel File Manager
   - Upload ไฟล์ไปยัง `/public_html/flood-rescue/`:
     - `api-example.js`
     - `dashboard-static.html` (เปลี่ยนชื่อเป็น `index.html`)
     - `package.json`
     - `.htaccess`

3. **ตั้งค่า API Server (ถ้า Server รองรับ Node.js):**
   ```bash
   # SSH เข้าไปยัง server
   cd /home/username/public_html/flood-rescue
   npm install express
   pm2 start api-example.js --name flood-rescue-api
   pm2 save
   ```

4. **ตั้งค่า Reverse Proxy (ถ้าใช้ nginx):**
   - ดูไฟล์ `nginx.conf.example`
   - แก้ไข domain เป็น `flood-rescue.dr9ohm.com`

5. **เข้าถึงได้ที่:** `https://flood-rescue.dr9ohm.com`

---

### วิธีที่ 2: ใช้ Path (dr9ohm.com/flood-rescue/)

#### ขั้นตอน:

1. **สร้างโฟลเดอร์:**
   - ใช้ cPanel File Manager
   - สร้างโฟลเดอร์ `/public_html/flood-rescue/`

2. **Upload ไฟล์:**
   - Upload ไฟล์ไปยัง `/public_html/flood-rescue/`:
     - `api-example.js`
     - `dashboard-static.html` (เปลี่ยนชื่อเป็น `index.html`)
     - `package.json`
     - `.htaccess`

3. **ตั้งค่า API Server** (เหมือนวิธีที่ 1)

4. **เข้าถึงได้ที่:** `https://dr9ohm.com/flood-rescue/`

---

### วิธีที่ 3: Deploy API แยก + Static Dashboard (ง่ายที่สุด)

#### ขั้นตอน:

1. **Deploy API ไปยัง Vercel (ฟรี):**
   ```bash
   npm install -g vercel
   cd flood-rescue-scout
   vercel
   ```
   - ได้ URL เช่น `https://flood-rescue-api.vercel.app`

2. **Upload แค่ Dashboard:**
   - Upload `dashboard-static.html` ไปยัง `/public_html/flood-rescue/`
   - เปลี่ยนชื่อเป็น `index.html`

3. **ตั้งค่า API URL ใน Dashboard:**
   - เปิด `https://dr9ohm.com/flood-rescue/`
   - ใส่ API URL: `https://flood-rescue-api.vercel.app/api/flood-rescue`
   - คลิก "บันทึก"

4. **เสร็จแล้ว!** คนอื่นเข้าถึงได้ที่ `https://dr9ohm.com/flood-rescue/`

---

## 🔧 ตรวจสอบ Server ของคุณ:

### ถ้าใช้ cPanel:

1. **ตรวจสอบว่า Server รองรับ Node.js:**
   - ไปที่ cPanel → Software → Setup Node.js App
   - ถ้ามี = ใช้ได้ (ใช้วิธีที่ 1 หรือ 2)
   - ถ้าไม่มี = ใช้วิธีที่ 3 (Deploy API แยก)

2. **ตรวจสอบว่าใช้ Apache หรือ nginx:**
   - Apache = ใช้ `.htaccess`
   - nginx = ใช้ `nginx.conf`

---

## 📝 ไฟล์ที่ต้อง Upload:

### ถ้า Server รองรับ Node.js:
- ✅ `api-example.js`
- ✅ `dashboard-static.html` (เปลี่ยนชื่อเป็น `index.html`)
- ✅ `package.json`
- ✅ `.htaccess` (ถ้าใช้ Apache)

### ถ้า Server ไม่รองรับ Node.js:
- ✅ `dashboard-static.html` (เปลี่ยนชื่อเป็น `index.html`)
- ✅ ตั้งค่า API URL จาก Vercel/Railway

---

## 🚀 Quick Start (แนะนำ):

### วิธีที่เร็วที่สุด:

1. **Deploy API ไปยัง Vercel:**
   ```bash
   npm install -g vercel
   cd flood-rescue-scout
   vercel
   ```
   - คัดลอก URL ที่ได้ เช่น `https://flood-rescue-api-xxx.vercel.app`

2. **Upload Dashboard:**
   - Upload `dashboard-static.html` ไปยัง `/public_html/flood-rescue/`
   - เปลี่ยนชื่อเป็น `index.html`

3. **ตั้งค่า:**
   - เปิด `https://dr9ohm.com/flood-rescue/`
   - ใส่ API URL: `https://flood-rescue-api-xxx.vercel.app/api/flood-rescue`
   - คลิก "บันทึก"

4. **แชร์ URL:** `https://dr9ohm.com/flood-rescue/`

---

## 💡 Tips:

1. **ใช้ Subdomain:** `flood-rescue.dr9ohm.com` (ดูเป็นระบบแยก)
2. **ตั้งค่า SSL:** ใช้ Let's Encrypt (ฟรี) ใน cPanel
3. **Backup:** Backup โฟลเดอร์ `data/` เป็นประจำ

---

## ❓ ถ้ามีปัญหา:

บอกได้ว่า:
- Server ใช้ cPanel หรือ VPS?
- รองรับ Node.js หรือไม่?
- ต้องการใช้ subdomain หรือ path?

จะช่วยตั้งค่าให้ต่อได้!

