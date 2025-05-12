# HR Dashboard: Employee Learning Report

Sistem ini merupakan dashboard HR yang digunakan untuk memonitor performa pelatihan karyawan. Melalui dashboard ini, admin dapat melihat progress belajar karyawan, skor quiz, serta mengekspor data ke dalam bentuk Excel.
Demo :
### 📽️ Demo Video

[![Lihat Video Demo](https://img.shields.io/badge/Watch-Demo%20Video-blue?style=for-the-badge&logo=playstation)](https://media-hosting.imagekit.io/06784817a1bf4002/bandicam%202025-05-13%2000-04-24-428.mp4?Expires=1841677985&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=A4DQeDvCryxDeKc236hsCz-ohnOc6i7QUoK7m-mm0G3KFpqk7MA3TZZAoYdNW0YQ7src8YYDcceOYw2iyLYACw7VzoVzeqDHKXAPZ4u3nUXQ-dDOI8KPY8tI3Z5MbB6PtSZBwpBe45Fo7S-Yj4ww5FmQ-mCUahoZKgX42goPdNeSsXpoTZGemvq16ePV-YIrB1seRefaXvGFAHWxNJN5LAbjSgZ-SXRlnIBE2YmvKetsLIFGudD7pA3DPFZAmeh6QACzuPFpuckSpBb332edlPBMbsgoaKbw-KCRu5cFsvkGIxlfLuOx~K08FcqGYsWguWWWR0FWAROJtA__)

---

## ✨ Fitur

- Menampilkan seluruh user dan progres pembelajaran mereka.
- Menampilkan skor quiz dari setiap user.
- Export laporan progress ke file Excel (berdasarkan user, group, atau keseluruhan).
- Menampilkan course dan tryout section yang sedang berjalan.
- Dashboard utama untuk monitoring progress secara real-time oleh HR/Admin.

---

## 🧱 Struktur Database (6 tabel)

Berikut tabel-tabel utama yang digunakan:

- `users`  
- `courses` (dengan `startDate`, `endDate`)
- `tryout_sections` (dengan `startDate`, `endDate`)
- `exams` (dengan `status`: `in-progress`, `completed`, `cancelled`, `submitted`)
- `groups`
- `users_groups` (relasi many-to-many antara user dan group)

---

## 📊 Progress & Perhitungan

- Hanya exam dengan status `completed` dan `submitted` yang digunakan untuk menghitung progress.
- Progress ditentukan berdasarkan keterlibatan user dalam courses dan tryout_sections yang sedang *running* (`startDate <= today <= endDate`).

---

## 🛠️ Backend API

Berikut adalah endpoint yang disediakan:

### 🔍 GET

- `/running-courses`  
  Mendapatkan daftar course yang sedang berjalan.

- `/running-tryout-sections`  
  Mendapatkan daftar tryout section yang sedang berjalan.

- `/progress`  
  Mendapatkan seluruh progress user terhadap course dan tryout section yang sedang berjalan.

### 📝 POST

- `/generate-report/progress`  
  Generate laporan progress ke file Excel.  

  **Request Body**:
  ```json
  {
    "referenceType": "user" | "group" | null,
    "referenceId": "<userId | groupId | null>"
  }
