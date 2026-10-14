# NJAcreative ✦ Setup Guide (Google Sheets + Apps Script + Admin)

Website ini sekarang memakai **Google Sheets** sebagai database dan **Google Apps Script** sebagai backend.  
Password admin & semua config sensitif **hanya** disimpan di Script Properties (tidak pernah di GitHub Pages).

---

## 1. Setup Google Apps Script (Backend)

1. Buka [script.google.com](https://script.google.com) → **New project**
2. Hapus kode default, lalu **paste seluruh isi** file  
   `apps-script/Code.gs`
3. Simpan project (beri nama misalnya `NJAcreative Backend`)
4. Jalankan fungsi **`setup`** sekali:
   - Pilih fungsi `setup` di dropdown
   - Klik **Run**
   - Authorize (pilih akun Google kamu → Advanced → Go to … → Allow)
5. Setelah berhasil, buka **View → Logs**. Kamu akan melihat:
   - Spreadsheet ID
   - Link ke Google Sheet yang baru dibuat
   - Password admin default: `Bismillaah`

### Deploy sebagai Web App

1. Klik **Deploy → New deployment**
2. Type: **Web app**
3. Description: `NJAcreative API v1`
4. **Execute as**: Me
5. **Who has access**: **Anyone**
6. Deploy → salin **Web App URL**  
   (bentuknya: `https://script.google.com/macros/s/XXXX/exec`)

---

## 2. Hubungkan Frontend ke Backend

Buka file `js/api.js` dan ganti baris ini:

```js
API_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
```

dengan URL Web App yang baru saja kamu salin.

Commit & push ke GitHub. GitHub Pages akan otomatis update.

---

## 3. Cara masuk Admin Panel

1. Buka website
2. **Klik logo “NJAcreative ✦” sebanyak 4 kali** berturut-turut (dalam ~1.2 detik)
3. Modal login muncul
4. Password: **`Bismillaah`** (atau yang sudah kamu ubah di Script Properties)

### Fitur Admin

| Tab        | Fitur                                      |
|------------|--------------------------------------------|
| **Produk** | CRUD lengkap (Create, Read, Update, Delete)|
| **Pesanan**| Lihat order + ubah status                  |
| **Pengaturan** | Judul situs, Instagram, QRIS image, ganti password |

Semua data tersimpan di Google Sheets yang digenerate otomatis:
- `Products`
- `Orders`
- `Settings`

---

## 4. Keamanan

- Password admin **tidak pernah** ada di kode frontend / GitHub
- Disimpan di `PropertiesService.getScriptProperties()`
- Session token berlaku 6 jam (disimpan di sessionStorage browser)
- Untuk ganti password: lewat Admin Panel → tab Pengaturan, atau jalankan fungsi `setAdminPassword("passwordbaru")` di Apps Script editor

---

## 5. Struktur Folder yang perlu di-push ke GitHub

```
├── index.html
├── style.css
├── script.js
├── CNAME
├── qris.jpg
├── css/
│   └── admin.css
├── js/
│   ├── api.js          ← ganti API_URL di sini
│   ├── store.js
│   └── admin.js
├── images/             ← favicon, hero, store images, dll
├── music/
└── apps-script/
    └── Code.gs         ← hanya untuk referensi, tidak perlu di-host
```

File `apps-script/Code.gs` **tidak** perlu di-upload ke GitHub Pages.  
Cukup simpan sebagai dokumentasi / backup.

---

## 6. Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Store kosong / loading terus | Pastikan `API_URL` sudah diganti & Web App di-deploy ulang |
| “Unauthorized” di admin | Login ulang (token expired) atau cek password di Script Properties |
| CORS / network error | Deploy ulang Web App (kadang perlu New version) |
| Sheet tidak terbuat | Jalankan `setup()` lagi dari editor Apps Script |

---

## 7. Pengembangan lanjutan (opsional)

Kamu bisa menambah sheet baru (misalnya `Songs`, `Notes`, `Works`) dengan cara yang sama:
1. Tambah `ensureSheet_()` di fungsi `setup()`
2. Tambah action di `handleRequest_()`
3. Buat UI CRUD di admin panel

Selamat mengelola toko kecilmu! ✦
