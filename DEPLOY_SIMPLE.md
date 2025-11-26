# 🚀 วิธี Deploy ไปยังโดเมนของคุณ (ง่ายที่สุด)

## 📋 สิ่งที่ต้องมี:

1. ✅ โดเมน (มีแล้ว)
2. ✅ Server/Hosting (cPanel, VPS, หรือ Shared Hosting)
3. ✅ FTP/SFTP access หรือ cPanel File Manager

---

## 🎯 วิธีที่ 1: Upload ไฟล์ไปยัง Server (ง่ายที่สุด)

### ขั้นตอน:

#### 1. เตรียมไฟล์ที่จะ Upload:

ไฟล์ที่ต้อง upload:
- ✅ `api-example.js` (API Server)
- ✅ `dashboard-static.html` (Dashboard - เปลี่ยนชื่อเป็น `index.html`)
- ✅ `package.json` (หรือแค่ dependencies)
- ✅ `data/` folder (จะสร้างอัตโนมัติเมื่อมีข้อมูล)

#### 2. Upload ไปยัง Server:

**วิธี A: ใช้ FTP Client (FileZilla, WinSCP)**
1. เปิด FTP Client
2. Connect ไปยัง server
3. Upload ไฟล์ทั้งหมดไปยังโฟลเดอร์ที่ต้องการ
   - เช่น `/public_html/flood-rescue/`
   - หรือ `/var/www/flood-rescue/`

**วิธี B: ใช้ cPanel File Manager**
1. ไปที่ cPanel → File Manager
2. ไปยังโฟลเดอร์ที่ต้องการ
3. Upload ไฟล์ทั้งหมด

#### 3. ตั้งค่า Server:

**ถ้า Server รองรับ Node.js:**

1. **SSH เข้าไปยัง Server:**
   ```bash
   ssh user@yourdomain.com
   ```

2. **ไปยังโฟลเดอร์ที่ upload:**
   ```bash
   cd /path/to/flood-rescue
   ```

3. **ติดตั้ง dependencies:**
   ```bash
   npm install express
   ```

4. **รัน API Server (ใช้ PM2):**
   ```bash
   npm install -g pm2
   pm2 start api-example.js --name flood-rescue-api
   pm2 save
   pm2 startup
   ```

5. **ตั้งค่า Reverse Proxy (nginx):**
   ```nginx
   server {
       listen 80;
       server_name flood-rescue.yourdomain.com;  # หรือ yourdomain.com/flood-rescue
       
       # Dashboard
       location / {
           root /path/to/flood-rescue;
           try_files $uri $uri/ /index.html;
       }
       
       # API
       location /api/ {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

**ถ้า Server ไม่รองรับ Node.js (ใช้แค่ Static HTML):**

1. **แก้ไข `dashboard-static.html`:**
   - เปลี่ยน API URL ให้ชี้ไปยัง API ที่ deploy แยก (Vercel, Railway, etc.)
   - หรือใช้ API จากที่อื่น

2. **Upload แค่ `dashboard-static.html`** (เปลี่ยนชื่อเป็น `index.html`)

3. **Deploy API แยก** ไปยัง:
   - Vercel (ฟรี)
   - Railway (ฟรี)
   - หรือ server อื่น

---

## 🎯 วิธีที่ 2: ใช้ Subdomain (แนะนำ)

### ขั้นตอน:

1. **สร้าง Subdomain:**
   - ไปที่ cPanel → Subdomains
   - หรือ DNS settings
   - สร้าง: `flood-rescue.yourdomain.com`
   - ชี้ไปยังโฟลเดอร์ `/public_html/flood-rescue/`

2. **Upload ไฟล์** ตามวิธีที่ 1

3. **ตั้งค่า nginx/apache** ให้ชี้ไปยัง subdomain

4. **เข้าถึงได้ที่:** `https://flood-rescue.yourdomain.com`

---

## 🎯 วิธีที่ 3: ใช้ cPanel Node.js (ถ้ามี)

### ขั้นตอน:

1. **ไปที่ cPanel → Software → Setup Node.js App**

2. **สร้าง App ใหม่:**
   - Node.js Version: เลือกล่าสุด
   - Application Root: `/home/username/flood-rescue`
   - Application URL: `flood-rescue.yourdomain.com`
   - Application Startup File: `api-example.js`

3. **Upload ไฟล์** ไปยังโฟลเดอร์ที่กำหนด

4. **ติดตั้ง dependencies:**
   - ใช้ Terminal ใน cPanel หรือ SSH
   - `npm install express`

5. **Restart App** ใน cPanel

---

## 🎯 วิธีที่ 4: ใช้ Static Site + External API

### ขั้นตอน:

1. **Deploy API ไปยัง Vercel/Railway:**
   - ได้ URL เช่น `https://flood-rescue-api.vercel.app`

2. **แก้ไข `dashboard-static.html`:**
   - ตั้งค่า API URL เป็น `https://flood-rescue-api.vercel.app/api/flood-rescue`

3. **Upload แค่ `dashboard-static.html`** ไปยัง server
   - เปลี่ยนชื่อเป็น `index.html`

4. **เข้าถึงได้ที่:** `https://yourdomain.com/flood-rescue/`

---

## 📝 ตัวอย่างโครงสร้างไฟล์บน Server:

```
/public_html/flood-rescue/
├── api-example.js          # API Server
├── dashboard-static.html   # Dashboard (เปลี่ยนชื่อเป็น index.html)
├── package.json            # Dependencies
├── data/                   # ข้อมูล (สร้างอัตโนมัติ)
│   ├── flood-rescue-*.json
│   └── flood-rescue-data.csv
└── node_modules/           # (สร้างจาก npm install)
```

---

## 🔧 ตั้งค่า PM2 (ให้ Server รันตลอด):

```bash
# ติดตั้ง PM2
npm install -g pm2

# รัน API Server
pm2 start api-example.js --name flood-rescue-api

# ดู status
pm2 status

# ดู logs
pm2 logs flood-rescue-api

# บันทึก configuration
pm2 save

# ตั้งค่าให้รันอัตโนมัติเมื่อ restart
pm2 startup
```

---

## 🔒 ตั้งค่า SSL/HTTPS (แนะนำ):

```bash
# ใช้ Let's Encrypt (ฟรี)
certbot --nginx -d flood-rescue.yourdomain.com
```

---

## ✅ Checklist:

- [ ] Upload ไฟล์ไปยัง server
- [ ] ติดตั้ง Node.js (ถ้ายังไม่มี)
- [ ] ติดตั้ง dependencies (`npm install express`)
- [ ] รัน API Server (ใช้ PM2)
- [ ] ตั้งค่า reverse proxy (nginx/apache)
- [ ] ตั้งค่า SSL/HTTPS
- [ ] ทดสอบ Dashboard
- [ ] แชร์ URL ให้คนอื่น

---

## 💡 Tips:

1. **ใช้ Subdomain:** `flood-rescue.yourdomain.com` (สะดวกกว่า)
2. **ใช้ PM2:** ให้ server รันตลอด
3. **Backup ข้อมูล:** Backup โฟลเดอร์ `data/` เป็นประจำ
4. **Monitor:** ใช้ `pm2 logs` เพื่อดู logs

---

## ❓ ถ้ามีปัญหา:

1. **ตรวจสอบว่า API Server รันอยู่:**
   ```bash
   pm2 list
   pm2 logs flood-rescue-api
   ```

2. **ตรวจสอบ port:**
   ```bash
   netstat -tulpn | grep 3000
   ```

3. **ตรวจสอบ nginx/apache config:**
   ```bash
   nginx -t  # สำหรับ nginx
   apachectl configtest  # สำหรับ apache
   ```

