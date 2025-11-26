# 🚀 วิธี Push โค้ดไปยัง GitHub

## ✅ โค้ดพร้อมแล้ว!

ฉันได้เตรียมโค้ดให้พร้อมแล้ว:
- ✅ Initialize git repository
- ✅ Add files
- ✅ Create commit

---

## 📋 ขั้นตอนต่อไป:

### 1. สร้าง GitHub Repository:

1. **ไปที่ https://github.com**
2. **Login** (หรือสมัครใหม่)
3. **คลิก "+" (มุมขวาบน) → "New repository"**
4. **ตั้งค่า:**
   - **Repository name:** `flood-rescue-scout`
   - **Description:** `Flood Rescue Scout API - AI-powered tool to extract flood rescue data`
   - **Public** หรือ **Private** (ตามต้องการ)
   - **อย่า** check "Initialize with README" (เพราะเรามีโค้ดแล้ว)
5. **คลิก "Create repository"**

### 2. Copy Repository URL:

หลังจากสร้าง repository จะได้ URL เช่น:
- `https://github.com/yourusername/flood-rescue-scout.git`

### 3. Push โค้ด:

รันคำสั่งนี้ (แก้ไข URL ให้ตรงกับของคุณ):

```bash
cd flood-rescue-scout
git remote add origin https://github.com/yourusername/flood-rescue-scout.git
git branch -M main
git push -u origin main
```

---

## 🎯 หลังจาก Push สำเร็จ:

1. **กลับไปที่ Vercel**
2. **คลิก "Continue with GitHub"**
3. **เลือก Repository:** `flood-rescue-scout`
4. **ตั้งค่า:**
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: (เว้นว่าง)
   - Output Directory: (เว้นว่าง)
5. **คลิก "Deploy"**

---

## ✅ Checklist:

- [ ] สร้าง GitHub Repository
- [ ] Copy Repository URL
- [ ] Add remote และ push โค้ด
- [ ] Deploy บน Vercel
- [ ] ได้ API URL

---

ลองทำตามขั้นตอนนี้ดูครับ!

