import { NextResponse } from "next/server";
import { updateInteractionStage } from "@/lib/google/repo";
import { STAGES } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/interactions/[id]">
) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const stage_after = body.stage_after;

    if (!STAGES.includes(stage_after)) {
      return NextResponse.json({ error: "Stage tidak valid." }, { status: 400 });
    }

    const updated = await updateInteractionStage(id, stage_after);
    if (!updated) {
      return NextResponse.json({ error: "Interaksi tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal mengubah stage." },
      { status: 500 }
    );
  }
}
