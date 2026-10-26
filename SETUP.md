# Setup Link Hub

Panduan untuk menjalankan Link Hub dengan data sendiri.

## Mode yang tersedia

| Mode | Cara | Data disimpan di |
|---|---|---|
| **Demo** | Buka URL dengan `?demo` di akhir | Memori saja, hilang saat dimuat ulang |
| **Lokal** | Buka tanpa setup apa pun | Browser di perangkat itu saja |
| **Tersinkron** | Ikuti langkah 2 di bawah | Google Sheet milik sendiri, sama di semua perangkat |

## 1. Hosting frontend (GitHub Pages)

1. Buat repo publik, misalnya `link-hub`, lalu upload semua file di repo ini.
2. **Settings → Pages → Deploy from a branch → `main` / root → Save.**
3. Setelah 1–2 menit, aplikasi bisa dibuka di `https://dionanantach.github.io/link-hub/`.

## 2. Backend Google Sheet + Apps Script

1. Buat Google Sheet baru, lalu buka **Ekstensi → Apps Script**.
2. Tempel isi `apps-script/Code.gs`. Ganti nilai `TOKEN` dengan kode rahasia buatan sendiri (minimal 24 karakter acak). **Jangan commit token ini ke repo.**
3. Ganti isi `appsscript.json` dengan `apps-script/appsscript.json` (aktifkan "Tampilkan file manifes" di pengaturan proyek kalau file ini belum terlihat).
4. Pilih fungsi **`setup`**, lalu klik **Run** dan setujui izinnya. Kalau muncul "Google belum memverifikasi aplikasi ini", pilih *Lanjutan → Buka*. Peringatan ini wajar karena script-nya milik sendiri.
5. **Deploy → Deployment baru → Aplikasi web**, dengan *Jalankan sebagai: Saya* dan *Akses: Siapa saja*. Salin URL yang berakhiran `/exec`.
6. Tes: membuka `<URL_EXEC>?action=list&token=<TOKEN>` harus menampilkan `"ok":true`.

Kolom yang dibutuhkan (`id, nama, url, kategori, catatan, ikon, warna, favorit, urutan`) dibuat otomatis di tab `Links`.

## 3. Sambungkan perangkat

Pilih salah satu cara:

- **Link setup:** buka `https://dionanantach.github.io/link-hub/#api=<URL_EXEC yang di-encode>&token=<TOKEN>` sekali di tiap perangkat. **Link ini rahasia, karena berisi token.**
- **Manual:** buka aplikasi → Pengaturan → tempel URL `/exec` dan token.

Supaya URL tidak perlu ditempel di tiap perangkat, isi `DEFAULT_API_URL` di `index.html` dengan URL `/exec`. Token tetap jangan ditulis di file itu.

## 4. Install di HP

- **Android (Chrome):** menu ⋮ → *Install aplikasi* / *Tambahkan ke layar utama*.
- **iPhone (Safari):** tombol Share → *Add to Home Screen*.

## Memperbarui backend

Setelah `Code.gs` diubah, perbarui deployment yang **sudah ada** (Deploy → Kelola deployment → edit → Versi baru). Jangan membuat deployment baru, karena URL `/exec` akan berubah. Dengan clasp: `clasp push`, lalu `clasp deploy -i <DEPLOYMENT_ID>`.

## Keamanan

- Siapa pun yang punya URL `/exec` **dan** token bisa membaca dan mengubah daftar link. Kalau token bocor, ganti `TOKEN` di Apps Script lalu perbarui deployment.
- Sheet ini cukup berisi daftar alamat link. Jangan simpan password atau data sensitif di dalamnya.
- Hanya link `http`/`https` yang ditampilkan.
