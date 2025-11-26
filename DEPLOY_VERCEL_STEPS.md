# 🚀 วิธี Deploy API ไปยัง Vercel

## ขั้นตอน:

### 1. Login Vercel:

```bash
cd flood-rescue-scout
vercel login
```

- จะเปิด browser ให้ login
- Login ด้วย GitHub, GitLab, หรือ Email

### 2. Deploy:

```bash
vercel --yes
```

- Vercel จะถามคำถาม:
  - **Set up and deploy?** → กด `Y`
  - **Which scope?** → เลือก account ของคุณ
  - **Link to existing project?** → กด `N` (สร้างใหม่)
  - **What's your project's name?** → กด Enter (ใช้ชื่อ default) หรือตั้งชื่อใหม่
  - **In which directory is your code located?** → กด Enter (ใช้ `./`)

### 3. รอ Deploy เสร็จ:

- Vercel จะ build และ deploy
- จะได้ URL เช่น: `https://flood-rescue-scout-xxx.vercel.app`

### 4. บันทึก API URL:

**API Endpoint:** `https://flood-rescue-scout-xxx.vercel.app/api/flood-rescue`

---

## 📝 หลังจาก Deploy สำเร็จ:

1. **ทดสอบ API:**
   - เปิด browser ไปที่: `https://your-project.vercel.app/api/flood-rescue`
   - ควรเห็น: `{"data":[]}` (ถ้ายังไม่มีข้อมูล)

2. **บันทึก API URL:**
   - คัดลอก URL: `https://your-project.vercel.app/api/flood-rescue`
   - ใช้ URL นี้ตั้งค่าใน Dashboard

3. **Upload Dashboard:**
   - Upload `dashboard-static.html` → `/public_html/flood-rescue/index.html`
   - ตั้งค่า API URL ใน Dashboard

---

## ✅ Checklist:

- [ ] Login Vercel (`vercel login`)
- [ ] Deploy (`vercel --yes`)
- [ ] บันทึก API URL
- [ ] ทดสอบ API
- [ ] Upload Dashboard
- [ ] ตั้งค่า API URL ใน Dashboard

