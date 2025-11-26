# 🚀 Deploy ไปยัง Vercel (ใช้ Dashboard - ง่ายที่สุด!)

## ⚡ วิธีที่ง่ายที่สุด (5 นาที):

### ขั้นตอน:

#### 1. ไปที่ Vercel Dashboard:
- เปิด browser ไปที่: **https://vercel.com**
- **Login** ด้วย GitHub, GitLab, หรือ Email
  - ถ้ายังไม่มี account → สมัครฟรี

#### 2. สร้าง Project ใหม่:
- คลิก **"Add New..."** → **"Project"**
- เลือก **"Deploy without Git"** (หรือ "Browse" ถ้ามี)

#### 3. Upload โฟลเดอร์:
- **ลากโฟลเดอร์ `flood-rescue-scout` ไปวาง** ใน Vercel
- หรือคลิก **"Browse"** แล้วเลือกโฟลเดอร์ `flood-rescue-scout`

#### 4. ตั้งค่า Project:
- **Framework Preset:** เลือก **"Other"** หรือ **"No Framework"**
- **Root Directory:** `./` (หรือเว้นว่าง)
- **Build Command:** (เว้นว่าง - ไม่ต้อง build)
- **Output Directory:** (เว้นว่าง)
- **Install Command:** `npm install` (ถ้าต้องการ)

#### 5. Deploy:
- คลิก **"Deploy"**
- รอประมาณ 1-2 นาที

#### 6. ได้ URL:
- Vercel จะให้ URL เช่น: `https://flood-rescue-scout-xxx.vercel.app`
- **API Endpoint:** `https://flood-rescue-scout-xxx.vercel.app/api/flood-rescue`

---

## 📝 ไฟล์ที่ต้อง Deploy:

Vercel จะ deploy ไฟล์ทั้งหมดในโฟลเดอร์ แต่ที่สำคัญคือ:
- ✅ `api/flood-rescue.js` (API endpoint)
- ✅ `vercel.json` (configuration)
- ✅ `package.json` (dependencies)

---

## ✅ หลังจาก Deploy สำเร็จ:

1. **ทดสอบ API:**
   - เปิด browser ไปที่: `https://your-project.vercel.app/api/flood-rescue`
   - ควรเห็น: `{"data":[]}` (ถ้ายังไม่มีข้อมูล)

2. **บันทึก API URL:**
   - คัดลอก URL: `https://your-project.vercel.app/api/flood-rescue`
   - ใช้ URL นี้ตั้งค่าใน Dashboard

3. **Upload Dashboard ไปยัง HostAtom:**
   - Upload `dashboard-static.html` → `/public_html/flood-rescue/index.html`
   - ตั้งค่า API URL ใน Dashboard

---

## 🎯 Quick Steps:

1. ✅ ไปที่ https://vercel.com
2. ✅ Login
3. ✅ Add New Project
4. ✅ Upload โฟลเดอร์ `flood-rescue-scout`
5. ✅ Deploy
6. ✅ ได้ API URL
7. ✅ ใช้ URL ตั้งค่าใน Dashboard

---

## 💡 Tips:

- **Vercel ฟรี** สำหรับ personal projects
- **Auto-deploy** เมื่อ push code (ถ้าใช้ Git)
- **HTTPS** อัตโนมัติ
- **Global CDN** - เร็วมาก

---

ลองทำตามขั้นตอนนี้ดูครับ ง่ายกว่าใช้ CLI มาก!

