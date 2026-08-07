import { NextResponse } from "next/server";
import { createInteraction, listInteractions } from "@/lib/google/repo";
import { POTENTIAL_SCORES, SOURCES, STAGES } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const interactions = await listInteractions();
    return NextResponse.json({ interactions });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load interactions" },
      { status: 500 }
    );
  }
}

const REQUIRED_FIELDS = [
  "stakeholder_id",
  "tujuan",
  "source",
  "potential_score",
  "periode",
  "stage_after",
] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    for (const field of REQUIRED_FIELDS) {
      if (!String(body[field] ?? "").trim()) {
        return NextResponse.json(
          { error: `Field "${field}" wajib diisi.` },
          { status: 400 }
        );
      }
    }
    if (!SOURCES.includes(body.source)) {
      return NextResponse.json({ error: "Source tidak valid." }, { status: 400 });
    }
    if (!POTENTIAL_SCORES.includes(body.potential_score)) {
      return NextResponse.json({ error: "Potential score tidak valid." }, { status: 400 });
    }
    if (!STAGES.includes(body.stage_after)) {
      return NextResponse.json({ error: "Stage tidak valid." }, { status: 400 });
    }

    const interaction = await createInteraction({
      stakeholder_id: String(body.stakeholder_id),
      tujuan: String(body.tujuan),
      pic_name: String(body.pic_name ?? ""),
      pic_role: String(body.pic_role ?? ""),
      phone: String(body.phone ?? ""),
      email: String(body.email ?? ""),
      source: body.source,
      potential_score: body.potential_score,
      periode: String(body.periode),
      stage_after: body.stage_after,
      hasil_pembahasan: String(body.hasil_pembahasan ?? ""),
      next_action: String(body.next_action ?? ""),
      next_follow_up_date: String(body.next_follow_up_date ?? ""),
      attachment: String(body.attachment ?? ""),
    });

    return NextResponse.json({ interaction }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create interaction" },
      { status: 500 }
    );
  }
}
