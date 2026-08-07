# BPS Outreach Tracker

Aplikasi web untuk tracking kunjungan Business Development individual — menggantikan proses manual spreadsheet → screenshot → PPT untuk reporting bulanan.

Dibangun dengan Next.js (App Router) + Google Sheets sebagai database (via service account) + Google Drive untuk lampiran.

## Status: Fase 1 (MVP)

- ✅ **Entity** — form wizard 4 langkah (pilih/tambah stakeholder → detail kunjungan → hasil & tindak lanjut → review) + voice-to-text untuk hasil pembahasan + upload lampiran ke Google Drive.
- ✅ Riwayat interaksi sederhana (list semua kunjungan yang sudah tercatat).
- ✅ Koneksi ke Google Sheets sebagai database, dengan auto-provisioning tab & header saat pertama kali dipakai.
- 🔜 **Pipeline** (Kanban board), **Dashboard** (analytics), dan **Laporan** (export PDF/PPT) menyusul di Fase 2 & 3.

## Menjalankan secara lokal

Lihat [SETUP.md](./SETUP.md) untuk panduan lengkap membuat Google Spreadsheet, service account, dan environment variables.

```bash
npm install
cp .env.example .env.local   # lalu isi kredensial Google
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Tech Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [googleapis](https://www.npmjs.com/package/googleapis) — Google Sheets API & Drive API (service account)
- [lucide-react](https://lucide.dev) — ikon
- Web Speech API — voice-to-text
- Deploy target: [Vercel](https://vercel.com), installable sebagai PWA di HP
