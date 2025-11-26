# 🚀 Deploy ไปยัง dr9ohm.com/flood-rescue/ (HostAtom)

## 📍 โดเมน: https://dr9ohm.com/flood-rescue/

---

## ⚡ วิธีที่ง่ายที่สุด (แนะนำ - 5 นาที):

### ขั้นตอนที่ 1: Deploy API ไปยัง Vercel (ฟรี)

```bash
npm install -g vercel
cd flood-rescue-scout
vercel
```

**ได้ URL เช่น:** `https://flood-rescue-api-abc123.vercel.app`

**บันทึก URL นี้ไว้!**

---

### ขั้นตอนที่ 2: Upload Dashboard ไปยัง HostAtom

#### วิธี A: ใช้ cPanel File Manager

1. **Login เข้า cPanel:**
   - ไปที่ `https://dr9ohm.com/cpanel` (หรือ URL ที่ HostAtom ให้)
   - Login ด้วย username และ password

2. **สร้างโฟลเดอร์:**
   - ไปที่ **File Manager**
   - ไปยัง `/public_html/` (หรือ `www/`)
   - คลิก **New Folder**
   - ตั้งชื่อ: `flood-rescue`
   - คลิก **Create**

3. **Upload ไฟล์:**
   - ไปยังโฟลเดอร์ `/public_html/flood-rescue/`
   - คลิก **Upload**
   - Upload ไฟล์ `dashboard-static.html`
   - หลังจาก upload เสร็จ:
     - คลิกขวาที่ไฟล์ `dashboard-static.html`
     - เลือก **Rename**
     - เปลี่ยนชื่อเป็น `index.html`

4. **ตั้งค่า Permissions:**
   - คลิกขวาที่โฟลเดอร์ `flood-rescue`
   - เลือก **Change Permissions**
   - ตั้งค่า: `755` (หรือ `0755`)

#### วิธี B: ใช้ FTP Client (FileZilla, WinSCP)

1. **Connect ไปยัง Server:**
   - Host: `ftp.dr9ohm.com` หรือ IP ที่ HostAtom ให้
   - Username: (จาก HostAtom)
   - Password: (จาก HostAtom)
   - Port: `21` (FTP) หรือ `22` (SFTP)

2. **Upload ไฟล์:**
   - ไปยัง `/public_html/flood-rescue/` (หรือ `/www/flood-rescue/`)
   - Upload `dashboard-static.html`
   - เปลี่ยนชื่อเป็น `index.html`

---

### ขั้นตอนที่ 3: ตั้งค่า API URL

1. **เปิด Dashboard:**
   - ไปที่ `https://dr9ohm.com/flood-rescue/`

2. **ตั้งค่า API URL:**
   - ในส่วน "⚙️ ตั้งค่า API Endpoint"
   - ใส่ URL: `https://flood-rescue-api-xxx.vercel.app/api/flood-rescue`
   - (ใส่ URL ที่ได้จาก Vercel)
   - คลิก **"บันทึก"**

3. **ทดสอบ:**
   - Dashboard ควรโหลดข้อมูลจาก API ได้
   - ถ้าเห็นข้อมูล = สำเร็จ!

---

## 🎯 วิธีที่ถาวร (ถ้า HostAtom รองรับ Node.js):

### ตรวจสอบว่า HostAtom รองรับ Node.js:

1. **Login เข้า cPanel**
2. **ดูว่ามี "Node.js Selector" หรือไม่:**
   - ไปที่ **Software** → **Setup Node.js App**
   - ถ้ามี = รองรับ Node.js ✅
   - ถ้าไม่มี = ใช้วิธีที่ 1 (Vercel) ✅

### ถ้ารองรับ Node.js:

#### ขั้นตอน:

1. **สร้าง Node.js App:**
   - ไปที่ cPanel → **Software** → **Setup Node.js App**
   - คลิก **Create Application**
   - ตั้งค่า:
     - **Node.js version:** เลือกล่าสุด
     - **Application root:** `/home/username/flood-rescue-api`
     - **Application URL:** `flood-rescue-api.dr9ohm.com` (หรือตามที่ต้องการ)
     - **Application startup file:** `api-example.js`

2. **Upload ไฟล์ API:**
   - Upload `api-example.js` และ `package.json` ไปยัง Application root

3. **ติดตั้ง dependencies:**
   - ใช้ Terminal ใน cPanel หรือ SSH
   - `cd /home/username/flood-rescue-api`
   - `npm install express`

4. **Restart App** ใน cPanel

5. **Upload Dashboard:**
   - Upload `dashboard-static.html` → `/public_html/flood-rescue/index.html`

6. **ตั้งค่า API URL:**
   - เปิด Dashboard
   - ใส่ API URL: `https://flood-rescue-api.dr9ohm.com/api/flood-rescue`
   - (หรือ URL ที่ตั้งค่าใน Node.js App)

---

## 📋 Checklist:

- [ ] Deploy API ไปยัง Vercel
- [ ] สร้างโฟลเดอร์ `/public_html/flood-rescue/`
- [ ] Upload `dashboard-static.html` → `index.html`
- [ ] ตั้งค่า API URL ใน Dashboard
- [ ] ทดสอบ Dashboard
- [ ] แชร์ URL: `https://dr9ohm.com/flood-rescue/`

---

## 🔧 ไฟล์ที่ต้อง Upload:

### วิธีที่ 1 (แนะนำ - ง่ายที่สุด):
- ✅ `dashboard-static.html` → เปลี่ยนชื่อเป็น `index.html`

### วิธีที่ 2 (ถ้ารองรับ Node.js):
- ✅ `api-example.js`
- ✅ `package.json`
- ✅ `dashboard-static.html` → `index.html`

---

## 💡 Tips:

1. **ใช้ Vercel สำหรับ API** = ง่ายที่สุด ไม่ต้องตั้งค่า server
2. **Dashboard เป็น Static HTML** = upload ง่าย ไม่ต้อง compile
3. **ตั้งค่า API URL ใน Dashboard** = ยืดหยุ่น เปลี่ยนได้ง่าย

---

## ❓ ถ้ามีปัญหา:

1. **Dashboard ไม่แสดง:**
   - ตรวจสอบว่าไฟล์ชื่อ `index.html` (ไม่ใช่ `dashboard-static.html`)
   - ตรวจสอบ permissions (ควรเป็น 755)

2. **API ไม่ทำงาน:**
   - ตรวจสอบว่า Vercel deploy สำเร็จ
   - ตรวจสอบ API URL ว่าถูกต้อง

3. **ติดต่อ HostAtom:**
   - ถ้ามีปัญหาเกี่ยวกับ server
   - โทร: (เบอร์ที่ HostAtom ให้)
   - หรือ Email support

---

## 🎉 หลังจาก Deploy สำเร็จ:

**แชร์ URL นี้ให้คนอื่น:**
**`https://dr9ohm.com/flood-rescue/`**

คนอื่นจะเห็น Dashboard และข้อมูลทั้งหมดที่ Submit แล้ว!

