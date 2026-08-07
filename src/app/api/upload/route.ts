import { NextResponse } from "next/server";
import { isDriveConfigured, uploadToDrive } from "@/lib/google/drive";

export const dynamic = "force-dynamic";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  if (!isDriveConfigured()) {
    return NextResponse.json(
      {
        error:
          "Upload lampiran belum dikonfigurasi (GOOGLE_DRIVE_FOLDER_ID kosong). Lihat SETUP.md.",
      },
      { status: 501 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 10MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const url = await uploadToDrive(
      buffer,
      fileName,
      file.type || "application/octet-stream"
    );

    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload gagal." },
      { status: 500 }
    );
  }
}
