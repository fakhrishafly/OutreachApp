import { NextResponse } from "next/server";
import { listTargets, upsertTarget } from "@/lib/google/repo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const targets = await listTargets();
    return NextResponse.json({ targets });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load targets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const periode = String(body.periode ?? "").trim();
    const target_visit = Number(body.target_visit);

    if (!periode) {
      return NextResponse.json({ error: "Periode wajib diisi." }, { status: 400 });
    }
    if (!Number.isFinite(target_visit) || target_visit < 0) {
      return NextResponse.json(
        { error: "Target kunjungan harus berupa angka ≥ 0." },
        { status: 400 }
      );
    }

    const target = await upsertTarget(periode, target_visit);
    return NextResponse.json({ target }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save target" },
      { status: 500 }
    );
  }
}
