# Setup — BPS Outreach Tracker

Panduan menyiapkan Google Sheets sebagai database, service account, dan (opsional) upload lampiran ke Google Drive.

## 1. Buat Google Spreadsheet

1. Buat 1 spreadsheet baru di [sheets.google.com](https://sheets.google.com), beri nama bebas (mis. "BPS Outreach Tracker - Database").
2. Aplikasi akan **otomatis membuat tab `Stakeholder` dan `Interaction` beserta header kolomnya** saat pertama kali dipakai — kamu tidak perlu membuat tab/header manual. Tab `Target` akan dipakai mulai Fase 2.
3. Salin ID spreadsheet dari URL-nya:
   `https://docs.google.com/spreadsheets/d/`**`<GOOGLE_SHEET_ID>`**`/edit`

## 2. Buat Service Account (Google Cloud)

1. Buka [Google Cloud Console](https://console.cloud.google.com/) → buat project baru (atau pakai yang sudah ada).
2. Aktifkan **Google Sheets API** (dan **Google Drive API** jika ingin memakai fitur upload lampiran):
   `APIs & Services` → `Enable APIs and Services` → cari & aktifkan keduanya.
3. Buat service account: `APIs & Services` → `Credentials` → `Create Credentials` → `Service Account`.
4. Setelah service account dibuat, buka tab `Keys` → `Add Key` → `Create new key` → pilih **JSON** → unduh file kredensialnya.
5. Dari file JSON tersebut, kamu butuh dua nilai:
   - `client_email` → isi ke `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → isi ke `GOOGLE_PRIVATE_KEY` (biarkan tanda `\n` apa adanya, jangan diubah jadi baris baru asli)

## 3. Share spreadsheet ke service account

Di Google Spreadsheet yang dibuat pada langkah 1, klik **Share**, lalu tambahkan email service account (`client_email` dari file JSON) sebagai **Editor**.

## 4. (Opsional) Setup Google Drive untuk lampiran

Jika ingin memakai fitur upload foto dokumentasi/kartu nama pada form kunjungan:

1. Buat folder baru di Google Drive, khusus untuk menyimpan lampiran.
2. Share folder tersebut ke email service account sebagai **Editor**.
3. Salin ID folder dari URL-nya:
   `https://drive.google.com/drive/folders/`**`<GOOGLE_DRIVE_FOLDER_ID>`**
4. Isi `GOOGLE_DRIVE_FOLDER_ID` di environment variable.

Jika langkah ini dilewati, form tetap bisa dipakai — bagian upload lampiran hanya akan menampilkan pesan bahwa fitur belum dikonfigurasi.

## 5. Isi Environment Variables

Salin `.env.example` menjadi `.env.local` lalu isi:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=...
GOOGLE_DRIVE_FOLDER_ID=...
```

Jalankan aplikasi secara lokal:

```
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) — otomatis diarahkan ke halaman **Entity**.

## 6. Deploy ke Vercel

1. Push repo ini ke GitHub, lalu import ke [vercel.com/new](https://vercel.com/new).
2. Di pengaturan project Vercel → `Environment Variables`, isi 4 variable yang sama seperti di atas.
3. Deploy. Aplikasi bisa langsung diakses dan di-install sebagai PWA dari HP (menu browser → "Add to Home Screen" / "Install App").

## Struktur data di Google Sheets

### Tab `Stakeholder`
| id | name | type | created_at |
|----|------|------|------------|

`type`: `Universitas/Politeknik`, `Developer`, `Kontraktor`, `Konsultan`, `Event or Exhibition`, `Lainnya`

### Tab `Interaction`
| id | stakeholder_id | tujuan | pic_name | pic_role | phone | email | source | potential_score | periode | stage_after | hasil_pembahasan | next_action | next_follow_up_date | attachment | created_at |
|----|----------------|--------|----------|----------|-------|-------|--------|------------------|---------|-------------|-------------------|-------------|----------------------|------------|------------|

- `source`: `Referral`, `Cold Outreach`, `Event`, `Inbound`, `Door to Door`, `Tender Indonesia`
- `potential_score`: `Hot`, `Warm`, `Cold`
- `periode`: format `YYYY-MM`, merepresentasikan periode custom 21–20 yang **dimulai** pada bulan tersebut (mis. `2026-07` = 21 Jul – 20 Agu 2026)
- `stage_after`: `Passive`, `Lead`, `Contacted`, `Meeting`, `Proposal Sent`, `Consideration`, `Conversion`

### Tab `Target` (dipakai mulai Fase 2)
| periode | target_visit |
|---------|--------------|

## Roadmap

- **Fase 1 (aktif sekarang):** Entity (form capture 4 langkah) + koneksi Google Sheets + riwayat interaksi sederhana.
- **Fase 2:** Pipeline (Kanban board) + Dashboard (funnel, bar chart, line chart target) + filter periode.
- **Fase 3:** Laporan — generate PDF/PPT otomatis.
