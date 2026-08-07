import { NextResponse } from "next/server";
import { createStakeholder, listStakeholders } from "@/lib/google/repo";
import { STAKEHOLDER_TYPES } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stakeholders = await listStakeholders();
    return NextResponse.json({ stakeholders });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load stakeholders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const type = String(body.type ?? "");

    if (!name) {
      return NextResponse.json({ error: "Nama stakeholder wajib diisi." }, { status: 400 });
    }
    if (!STAKEHOLDER_TYPES.includes(type as (typeof STAKEHOLDER_TYPES)[number])) {
      return NextResponse.json({ error: "Tipe stakeholder tidak valid." }, { status: 400 });
    }

    const stakeholder = await createStakeholder({
      name,
      type: type as (typeof STAKEHOLDER_TYPES)[number],
    });
    return NextResponse.json({ stakeholder }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create stakeholder" },
      { status: 500 }
    );
  }
}
