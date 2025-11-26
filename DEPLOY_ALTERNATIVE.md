# 🚀 วิธี Deploy ไปยัง Vercel (ทางเลือก)

## วิธีที่ 1: ใช้ Vercel Dashboard (แนะนำ - ง่ายกว่า)

### ขั้นตอน:

1. **ไปที่ https://vercel.com**
2. **Login** ด้วย GitHub, GitLab, หรือ Email
3. **คลิก "Add New..." → "Project"**
4. **Import Git Repository:**
   - ถ้ามี GitHub repo = เลือก repo
   - ถ้าไม่มี = ใช้ "Deploy without Git"
5. **Upload โฟลเดอร์:**
   - ลากโฟลเดอร์ `flood-rescue-scout` ไปวาง
   - หรือเลือก "Browse" แล้วเลือกโฟลเดอร์
6. **ตั้งค่า:**
   - **Framework Preset:** Other
   - **Root Directory:** `./` (หรือเว้นว่าง)
   - **Build Command:** (เว้นว่าง - ไม่ต้อง build)
   - **Output Directory:** (เว้นว่าง)
7. **คลิก "Deploy"**
8. **รอ Deploy เสร็จ** (ประมาณ 1-2 นาที)
9. **ได้ URL:** `https://your-project.vercel.app`
10. **API Endpoint:** `https://your-project.vercel.app/api/flood-rescue`

---

## วิธีที่ 2: ใช้ GitHub (ถ้ามี GitHub)

### ขั้นตอน:

1. **Push โค้ดไปยัง GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/flood-rescue-scout.git
   git push -u origin main
   ```

2. **ไปที่ Vercel Dashboard**
3. **Import Project จาก GitHub**
4. **เลือก Repository**
5. **Deploy**

---

## วิธีที่ 3: ใช้ CLI (ถ้า login สำเร็จ)

```bash
cd flood-rescue-scout
vercel --yes
```

---

## 📝 ไฟล์ที่ต้อง Deploy:

- ✅ `api/flood-rescue.js`
- ✅ `vercel.json`
- ✅ `package.json`

---

## ✅ หลังจาก Deploy สำเร็จ:

**API Endpoint:** `https://your-project.vercel.app/api/flood-rescue`

ใช้ URL นี้ตั้งค่าใน Dashboard!

