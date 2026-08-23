# BPS Outreach Tracker

Aplikasi web untuk tracking kunjungan Business Development individual — menggantikan proses manual spreadsheet → screenshot → PPT untuk reporting bulanan.

Dibangun dengan Next.js (App Router) + Google Sheets sebagai database (via service account) + Vercel Blob Storage untuk lampiran.

## Status: Fase 2

- ✅ **Entity** — form wizard 4 langkah (pilih/tambah stakeholder → detail kunjungan → hasil & tindak lanjut → review) + voice-to-text untuk hasil pembahasan + upload lampiran ke Vercel Blob. Riwayat interaksi dengan filter periode.
- ✅ **Pipeline** — papan Kanban per stage (7 kolom), kartu berwarna sesuai potential score. Update stage lewat drag-and-drop (desktop) atau dropdown per kartu (selalu berfungsi, termasuk di HP). Filter: tipe stakeholder, PIC, periode.
- ✅ **Dashboard** — funnel chart per stage, bar chart visit per tipe stakeholder, line chart kunjungan aktual vs target (semua periode), list "Perlu Follow-up" & "Top Potential Leads", plus form untuk mengatur target kunjungan per periode.
- ✅ Filter periode (tunggal/rentang) sticky di Entity (riwayat), Pipeline, dan Dashboard — semua chart/list otomatis menyesuaikan.
- ✅ Koneksi ke Google Sheets sebagai database, dengan auto-provisioning tab & header saat pertama kali dipakai.
- 🔜 **Laporan** (export PDF/PPT otomatis) menyusul di Fase 3.

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
- [googleapis](https://www.npmjs.com/package/googleapis) — Google Sheets API (service account)
- [@vercel/blob](https://vercel.com/docs/storage/vercel-blob) — upload lampiran (foto dokumentasi/kartu nama)
- [recharts](https://recharts.org) — funnel/bar/line chart di Dashboard
- [@dnd-kit/core](https://dndkit.com) — drag-and-drop di papan Kanban Pipeline
- [lucide-react](https://lucide.dev) — ikon
- Web Speech API — voice-to-text
- Deploy target: [Vercel](https://vercel.com), installable sebagai PWA di HP
