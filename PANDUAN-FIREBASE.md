# Panduan Firebase untuk NJAcreative Little Store

## Langkah 1 — Buat project Firebase

1. Buka https://console.firebase.google.com/
2. Klik **Add project** / **Tambahkan project**
3. Nama project bebas, contoh: `njacreatives-store`
4. Matikan Google Analytics jika tidak perlu → Create project

## Langkah 2 — Aktifkan Authentication

1. Di menu kiri → **Build** → **Authentication**
2. Klik **Get started**
3. Tab **Sign-in method** → pilih **Email/Password** → Enable → Save
4. Tab **Users** → **Add user**
   - Email: email kamu
   - Password: buat password yang kuat (ini password admin)
5. Simpan email & password itu

## Langkah 3 — Buat Firestore Database

1. Menu kiri → **Build** → **Firestore Database**
2. Klik **Create database**
3. Pilih **Start in test mode** dulu (nanti bisa dikunci)
4. Pilih lokasi terdekat (contoh: `asia-southeast2` / Jakarta) → Enable

### Rules sementara (test mode)
Nanti di tab **Rules** bisa diganti jadi lebih aman. Untuk awal, test mode cukup.

Agar hanya admin yang bisa tulis, setelah login jalan, ganti rules menjadi kira-kira:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Artinya: semua orang bisa baca produk, hanya yang login yang bisa ubah.

## Langkah 4 — Ambil Config Web

1. Project Overview (ikon gear) → **Project settings**
2. Scroll ke **Your apps** → klik ikon **Web** (`</>`)
3. App nickname: `njacreatives`
4. Jangan centang Firebase Hosting
5. Copy object `firebaseConfig` yang muncul

## Langkah 5 — Masukkan config ke admin.html

1. Buka file `admin.html`
2. Cari bagian:
```js
const firebaseConfig = {
  apiKey: "GANTI_API_KEY",
  ...
};
```
3. Ganti semua nilai dengan config dari Firebase Console

## Langkah 6 — Deploy

1. Upload semua file (termasuk `admin.html`) ke repo GitHub
2. Push / deploy
3. Buka: `https://njacreatives.my.id/admin.html`
4. Login dengan email + password yang dibuat di Langkah 2
5. Tambah 3 produk (Flower Pin, Flower Clay Rings, Fluffy Doll)

### Contoh data produk pertama

| Nama | Harga | Deskripsi | URL gambar |
|------|-------|-----------|------------|
| Flower Pin | 25000 | Soft flower charm keychain — tiny & pretty ♡ | images/product-1-flower-pin.jpg |
| Flower Clay Rings | 35000 | Acrylic flower clay rings — handmade soft colors ♡ | images/product-2-flower-rings.jpg |
| Fluffy Doll | 45000 | Soft fluffy doll with ribbon — little companion ♡ | images/product-3-fluffy-doll.jpg |

Link beli bisa pakai: `https://instagram.com/kknjau`

## Langkah 7 (opsional) — Landing page baca dari Firestore

Saat ini `index.html` masih menampilkan produk hardcode (sudah diganti foto).
Kalau ingin produk di homepage **otomatis ikut** dari Firebase, bilang saja nanti dibuatkan script-nya.

## Keamanan

- Jangan share password admin
- Setelah stabil, pastikan Firestore Rules hanya mengizinkan `write` jika `request.auth != null`
- Halaman admin sudah `noindex` (tidak muncul di Google)

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Login gagal | Cek email/password di Authentication → Users |
| “Missing or insufficient permissions” | Perbaiki Firestore Rules |
| Produk tidak muncul | Pastikan collection name = `products` |
| Config error | Pastikan apiKey & projectId sudah diganti |

Selesai. Setelah config diisi, admin langsung bisa dipakai.
