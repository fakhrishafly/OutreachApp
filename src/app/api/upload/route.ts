import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
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

    const pathname = `attachments/${Date.now()}-${file.name}`;
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload gagal." },
      { status: 500 }
    );
  }
}
