# วิธี Deploy Dashboard ไปยังโดเมนของคุณ

## 🎯 วิธี Deploy ไปยัง Server ที่มีอยู่

### วิธีที่ 1: Upload ไฟล์ไปยัง Server (ง่ายที่สุด)

#### ขั้นตอน:

1. **เตรียมไฟล์:**
   - `api-example.js`
   - `dashboard.html`
   - `package.json` (หรือแค่ express)
   - `data/` folder (จะสร้างอัตโนมัติ)

2. **Upload ไปยัง Server:**
   - ใช้ FTP, SFTP, หรือ cPanel File Manager
   - Upload ไปยังโฟลเดอร์ที่ต้องการ เช่น `/public_html/flood-rescue/`

3. **ติดตั้ง Node.js บน Server:**
   ```bash
   # เช็คว่า server มี Node.js หรือไม่
   node --version
   
   # ถ้าไม่มี ต้องติดตั้ง (ขึ้นอยู่กับ OS)
   ```

4. **ติดตั้ง dependencies:**
   ```bash
   cd /path/to/flood-rescue
   npm install express
   ```

5. **รัน API Server:**
   ```bash
   # ใช้ PM2 (แนะนำ)
   npm install -g pm2
   pm2 start api-example.js --name flood-rescue-api
   pm2 save
   pm2 startup
   ```

6. **ตั้งค่า Reverse Proxy (ถ้าใช้ nginx):**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       # Dashboard
       location / {
           root /path/to/flood-rescue;
           try_files $uri $uri/ /dashboard.html;
       }
       
       # API
       location /api/ {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

### วิธีที่ 2: ใช้ Subdomain (แนะนำ)

#### ขั้นตอน:

1. **สร้าง Subdomain:**
   - ไปที่ cPanel หรือ DNS settings
   - สร้าง subdomain เช่น `flood-rescue.yourdomain.com`
   - ชี้ไปยังโฟลเดอร์ `/public_html/flood-rescue/`

2. **Upload ไฟล์** ตามวิธีที่ 1

3. **ตั้งค่า nginx/apache** ให้ชี้ไปยัง subdomain

---

### วิธีที่ 3: ใช้ Static Site + API (ถ้า Server ไม่รองรับ Node.js)

#### สร้าง Static Dashboard:

1. **แก้ไข `dashboard.html`:**
   - เปลี่ยน API_URL ให้ชี้ไปยัง API endpoint ที่ deploy แยก
   - หรือใช้ API จากที่อื่น

2. **Upload แค่ `dashboard.html`** ไปยัง server

3. **Deploy API แยก** (ใช้ Vercel, Railway, หรือ server อื่น)

---

### วิธีที่ 4: ใช้ cPanel (ถ้าใช้ Shared Hosting)

#### ขั้นตอน:

1. **ตรวจสอบว่า cPanel รองรับ Node.js:**
   - ไปที่ cPanel → Software → Setup Node.js App
   - ถ้ามี = ใช้ได้

2. **สร้าง Node.js App:**
   - ตั้งชื่อ app: `flood-rescue`
   - เลือก Node.js version
   - ตั้งค่า Startup File: `api-example.js`

3. **Upload ไฟล์:**
   - Upload ไฟล์ทั้งหมดไปยังโฟลเดอร์ที่ cPanel สร้างให้

4. **ติดตั้ง dependencies:**
   - ใช้ Terminal ใน cPanel หรือ SSH
   - `npm install express`

5. **Restart App** ใน cPanel

---

## 📝 ตัวอย่างการตั้งค่า

### ถ้าใช้ nginx:

```nginx
server {
    listen 80;
    server_name flood-rescue.yourdomain.com;
    
    root /var/www/flood-rescue;
    index dashboard.html;
    
    # Serve dashboard
    location / {
        try_files $uri $uri/ /dashboard.html;
    }
    
    # API endpoint
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### ถ้าใช้ Apache (.htaccess):

```apache
RewriteEngine On
RewriteBase /

# API proxy
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]

# Dashboard
RewriteRule ^$ dashboard.html [L]
```

---

## 🔧 ตั้งค่า Environment Variables (ถ้าต้องการ)

สร้างไฟล์ `.env`:
```
PORT=3000
NODE_ENV=production
```

---

## 🚀 ใช้ PM2 เพื่อให้ Server รันตลอด

```bash
# ติดตั้ง PM2
npm install -g pm2

# รัน API Server
pm2 start api-example.js --name flood-rescue-api

# บันทึก configuration
pm2 save

# ตั้งค่าให้รันอัตโนมัติเมื่อ restart
pm2 startup
```

---

## 📋 Checklist:

- [ ] Upload ไฟล์ไปยัง server
- [ ] ติดตั้ง Node.js (ถ้ายังไม่มี)
- [ ] ติดตั้ง dependencies (`npm install express`)
- [ ] ตั้งค่า reverse proxy (nginx/apache)
- [ ] รัน API Server (ใช้ PM2)
- [ ] ทดสอบว่า Dashboard ทำงาน
- [ ] ตั้งค่า SSL/HTTPS (แนะนำ)

---

## 💡 Tips:

1. **ใช้ PM2** เพื่อให้ server รันตลอด
2. **ตั้งค่า SSL** ด้วย Let's Encrypt (ฟรี)
3. **Backup ข้อมูล** ในโฟลเดอร์ `data/` เป็นประจำ
4. **Monitor logs** ด้วย `pm2 logs flood-rescue-api`

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

3. **ตรวจสอบ firewall:**
   - เปิด port 3000 (ถ้าต้องการเข้าถึงโดยตรง)
   - หรือใช้ reverse proxy (แนะนำ)

