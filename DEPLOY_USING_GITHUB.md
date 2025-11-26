# 🚀 Deploy ไปยัง Vercel ผ่าน GitHub (แนะนำ)

## ขั้นตอน:

### 1. สร้าง GitHub Repository:

```bash
cd flood-rescue-scout
git init
git add .
git commit -m "Initial commit - Flood Rescue Scout API"
```

### 2. Push ไปยัง GitHub:

- ไปที่ https://github.com
- สร้าง Repository ใหม่ (ตั้งชื่อ `flood-rescue-scout`)
- Copy URL (เช่น `https://github.com/yourusername/flood-rescue-scout.git`)

```bash
git remote add origin https://github.com/yourusername/flood-rescue-scout.git
git branch -M main
git push -u origin main
```

### 3. Deploy บน Vercel:

1. **คลิก "Continue with GitHub"** ในหน้า Vercel
2. **Authorize Vercel** (ถ้ายังไม่เคย)
3. **เลือก Repository:** `flood-rescue-scout`
4. **ตั้งค่า:**
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: (เว้นว่าง)
   - Output Directory: (เว้นว่าง)
5. **คลิก "Deploy"**

### 4. ได้ URL:

- Vercel จะให้ URL เช่น: `https://flood-rescue-scout-xxx.vercel.app`
- **API Endpoint:** `https://flood-rescue-scout-xxx.vercel.app/api/flood-rescue`

---

## ✅ ข้อดี:

- ✅ Auto-deploy เมื่อ push code
- ✅ Version control
- ✅ ง่ายต่อการจัดการ

---

ลองทำตามขั้นตอนนี้ดูครับ!

