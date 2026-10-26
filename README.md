# Link Hub

Shortcut card ke link kerjaan. Tambah, edit, dan hapus link langsung dari aplikasi. Kalau disambungkan ke Google Sheet, isinya sama persis di laptop dan HP.

## Isi folder

| File | Fungsi |
|---|---|
| `index.html` | Aplikasinya (tampilan + logika) |
| `manifest.json`, `sw.js`, `icons/` | Supaya bisa di-install di HP dan tetap kebuka saat offline |
| `apps-script/Code.gs` | Backend kecil di Google Sheet untuk menyimpan link (opsional tapi disarankan) |
| `links-template.csv` | Contoh isi awal Sheet, kalau mau import sekaligus |

## Dua mode penyimpanan

- **Tersimpan di perangkat ini** (default, tanpa setup). Link yang kamu tambah hanya ada di browser itu. Cocok untuk coba-coba.
- **Tersinkron dengan Google Sheet.** Link disimpan di Sheet, jadi laptop dan HP sama. Link yang sudah kamu tambah di mode lokal akan ditawarkan untuk dipindahkan ke Sheet saat pertama kali menyambung.

## 1. Online-kan lewat GitHub Pages

1. Buat repo baru di GitHub, misalnya `link-hub` (Public).
2. Upload semua isi folder ini (Add file → Upload files), termasuk folder `icons`. Folder `apps-script` boleh ikut diupload, isinya tidak dipakai oleh halaman.
3. Settings → Pages → Source: **Deploy from a branch** → Branch `main` / `root` → Save.
4. Tunggu 1–2 menit, aplikasi bisa dibuka di `https://<username>.github.io/link-hub/`.

## 2. Sambungkan ke Google Sheet (supaya sinkron)

1. Buat Google Sheet baru, kasih nama bebas (misalnya "Link Hub").
2. **Ekstensi → Apps Script**. Hapus isi default, tempel seluruh isi `apps-script/Code.gs`.
3. Ganti baris `const TOKEN = "ganti-dengan-kode-rahasiamu";` dengan kode rahasia buatanmu sendiri (minimal 12 karakter, misalnya kombinasi kata + angka). Simpan.
4. **Deploy → Deployment baru** → ikon gear → **Aplikasi web**.
   - Jalankan sebagai: **Saya**
   - Yang memiliki akses: **Siapa saja**
   - Klik Deploy, lalu izinkan akses (kalau muncul peringatan "Google belum memverifikasi aplikasi ini", pilih Lanjutan → Buka). Ini wajar karena script-nya buatanmu sendiri.
5. Salin **URL aplikasi web** (berakhiran `/exec`).
6. Buka Link Hub → ikon gear → tempel URL dan token → **Simpan & sambungkan**. Tab bernama `Links` akan dibuat otomatis. (Kalau kamu import `links-template.csv` sendiri, ganti nama tab hasil import-nya jadi `Links`.)
7. Ulangi langkah 6 di HP (cukup sekali per perangkat).

Supaya URL tidak perlu ditempel di tiap perangkat, isi `DEFAULT_API_URL` di bagian atas `<script>` dalam `index.html`. **Token jangan ditulis di file itu**, karena repo GitHub-nya publik.

> Keamanan: siapa pun yang tahu URL `/exec` **dan** token bisa membaca dan mengubah daftar link. Tanpa token, permintaan ditolak. Jadi jangan bagikan tokennya, dan jangan simpan password di Sheet ini.

### Kalau nanti Code.gs diubah

Pakai **Deploy → Kelola deployment → edit (ikon pensil) → Versi: Versi baru → Deploy**. Kalau membuat "Deployment baru" lagi, URL-nya berubah dan harus ditempel ulang di aplikasi.

## 3. Install di HP

- **Android (Chrome):** buka link GitHub Pages → menu ⋮ → **Tambahkan ke layar utama / Install aplikasi**.
- **iPhone (Safari):** tombol Share → **Add to Home Screen**.

## Pemakaian harian

- **Tambah link:** tombol **Tambah** (di HP tombol bulat **+** di kanan bawah). Cukup tempel URL; nama dan ikon terisi otomatis kalau dikosongkan.
- **Edit/hapus:** ikon pensil di card (di laptop muncul saat kursor di atas card).
- **Ikon:** otomatis diambil dari favicon situsnya. Kalau ada link yang ikonnya kurang pas, isi kolom "Link gambar ikon" dengan URL gambar (.png/.svg).
- Bisa juga mengetik langsung di Sheet. Kolom `id` boleh dikosongkan, nanti diisi otomatis.
- Bintang ★ → Favorit (tampil paling atas). Favorit dan riwayat "Terakhir dibuka" tersimpan per perangkat.
- Laptop: tekan `/` untuk langsung mencari, `Enter` untuk membuka hasil pertama.
