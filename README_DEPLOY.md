# 🚀 วิธี Deploy ไปยัง dr9ohm.com

## 📍 โดเมน: https://dr9ohm.com/

---

## ⚡ วิธีที่เร็วที่สุด (5 นาที):

### 1. Deploy API ไปยัง Vercel (ฟรี):

```bash
npm install -g vercel
cd flood-rescue-scout
vercel
```

**ได้ URL เช่น:** `https://flood-rescue-api-abc123.vercel.app`

### 2. Upload Dashboard ไปยัง dr9ohm.com:

1. **ใช้ FTP หรือ cPanel File Manager**
2. **Upload ไฟล์:**
   - `dashboard-static.html` → `/public_html/flood-rescue/index.html`

3. **เข้าถึง:** `https://dr9ohm.com/flood-rescue/`

4. **ตั้งค่า API URL:**
   - เปิด Dashboard
   - ใส่ API URL: `https://flood-rescue-api-abc123.vercel.app/api/flood-rescue`
   - คลิก "บันทึก"

### 3. แชร์ URL:
**`https://dr9ohm.com/flood-rescue/`**

---

## 🎯 วิธีที่ถาวร (ใช้ Subdomain):

### 1. สร้าง Subdomain:
- ไปที่ cPanel → Subdomains
- สร้าง: `flood-rescue.dr9ohm.com`
- Document Root: `/public_html/flood-rescue`

### 2. Upload ไฟล์:
- `api-example.js`
- `dashboard-static.html` → `index.html`
- `package.json`
- `.htaccess`

### 3. ตั้งค่า API Server:
```bash
cd /home/username/public_html/flood-rescue
npm install express
pm2 start api-example.js --name flood-rescue-api
pm2 save
```

### 4. ตั้งค่า Reverse Proxy (nginx):
- ดูไฟล์ `nginx.conf.example`
- แก้ไข domain เป็น `flood-rescue.dr9ohm.com`

### 5. เข้าถึงได้ที่:
**`https://flood-rescue.dr9ohm.com`**

---

## 📋 Checklist:

- [ ] Deploy API (Vercel หรือ Server)
- [ ] Upload Dashboard
- [ ] ตั้งค่า API URL
- [ ] ทดสอบ Dashboard
- [ ] ตั้งค่า SSL/HTTPS
- [ ] แชร์ URL ให้คนอื่น

---

## 💡 คำแนะนำ:

- **ถ้าต้องการเร็ว:** ใช้วิธีที่ 1 (Vercel + Static Dashboard)
- **ถ้าต้องการถาวร:** ใช้ Subdomain + API Server บน Server

