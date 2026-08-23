import type PptxGenJSType from "pptxgenjs";
import { CHART_NEUTRAL, STAGE_HEX } from "./colors";
import type { FunnelPoint, TypeVisitPoint, VisitVsTargetPoint } from "./analytics";
import type { PipelineCard } from "./pipeline";
import { periodeFromValue } from "./periode";
import type { Interaction } from "./types";

export interface ReportData {
  periodeLabel: string;
  funnel: FunnelPoint[];
  visitsByType: TypeVisitPoint[];
  vsTarget: VisitVsTargetPoint[];
  table: Interaction[];
  conversions: Interaction[];
  activePipeline: PipelineCard[];
}

const toHex = (h: string) => h.replace("#", "").toUpperCase();

const NEUTRAL_DARK = toHex(CHART_NEUTRAL.primary);
const NEUTRAL_LIGHT = toHex(CHART_NEUTRAL.secondary);
const TEXT_DARK = "111827";
const TEXT_MUTED = "6B7280";
const BORDER = "E5E7EB";

function addHeader(slide: PptxGenJSType.Slide, title: string, subtitle?: string) {
  slide.addText(title, {
    x: 0.6,
    y: 0.35,
    w: 12,
    h: 0.5,
    fontSize: 20,
    bold: true,
    color: TEXT_DARK,
    fontFace: "Arial",
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6,
      y: 0.82,
      w: 12,
      h: 0.35,
      fontSize: 11,
      color: TEXT_MUTED,
      fontFace: "Arial",
    });
  }
}

function addEmptyNote(slide: PptxGenJSType.Slide, text: string) {
  slide.addText(text, { x: 0.6, y: 1.5, w: 11, fontSize: 12, color: TEXT_MUTED, fontFace: "Arial" });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function generateReportPptx(data: ReportData): Promise<void> {
  const { default: PptxGenJS } = await import("pptxgenjs");
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";

  // Cover
  const cover = pptx.addSlide();
  cover.addText("Laporan Outreach", {
    x: 0.6,
    y: 2.3,
    w: 12,
    h: 0.9,
    fontSize: 32,
    bold: true,
    color: TEXT_DARK,
    fontFace: "Arial",
  });
  cover.addText("BPS Outreach Tracker", {
    x: 0.6,
    y: 3.05,
    w: 12,
    h: 0.5,
    fontSize: 16,
    color: TEXT_MUTED,
    fontFace: "Arial",
  });
  cover.addText(data.periodeLabel, {
    x: 0.6,
    y: 3.7,
    w: 12,
    h: 0.5,
    fontSize: 18,
    bold: true,
    color: TEXT_DARK,
    fontFace: "Arial",
  });
  cover.addText(
    `Dibuat ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`,
    { x: 0.6, y: 4.3, w: 12, h: 0.4, fontSize: 12, color: TEXT_MUTED, fontFace: "Arial" }
  );

  // Funnel pipeline — horizontal bar, one color per stage
  const funnelSlide = pptx.addSlide();
  addHeader(funnelSlide, "Funnel Pipeline", "Jumlah stakeholder per stage");
  funnelSlide.addChart(
    pptx.ChartType.bar,
    [
      {
        name: "Stakeholder",
        labels: data.funnel.map((f) => f.stage),
        values: data.funnel.map((f) => f.count),
      },
    ],
    {
      x: 0.6,
      y: 1.3,
      w: 12.1,
      h: 5.6,
      barDir: "bar",
      showLegend: false,
      showValue: true,
      chartColors: data.funnel.map((f) => toHex(STAGE_HEX[f.stage])),
      catAxisLabelColor: TEXT_MUTED,
      valAxisLabelColor: TEXT_MUTED,
      dataLabelColor: TEXT_DARK,
    }
  );

  // Visit per stakeholder type — vertical bar
  const typeSlide = pptx.addSlide();
  addHeader(typeSlide, "Visit per Tipe Stakeholder", "Jumlah kunjungan tercatat per tipe");
  typeSlide.addChart(
    pptx.ChartType.bar,
    [
      {
        name: "Visit",
        labels: data.visitsByType.map((t) => t.type),
        values: data.visitsByType.map((t) => t.count),
      },
    ],
    {
      x: 0.6,
      y: 1.3,
      w: 12.1,
      h: 5.6,
      barDir: "col",
      showLegend: false,
      showValue: true,
      chartColors: [NEUTRAL_DARK],
      catAxisLabelColor: TEXT_MUTED,
      valAxisLabelColor: TEXT_MUTED,
      dataLabelColor: TEXT_DARK,
    }
  );

  // Kunjungan aktual vs target — clustered vertical bar
  const vsTargetSlide = pptx.addSlide();
  addHeader(vsTargetSlide, "Kunjungan Aktual vs Target", data.periodeLabel);
  vsTargetSlide.addChart(
    pptx.ChartType.bar,
    [
      {
        name: "Aktual",
        labels: data.vsTarget.map((d) => d.label),
        values: data.vsTarget.map((d) => d.actual),
      },
      {
        name: "Target",
        labels: data.vsTarget.map((d) => d.label),
        values: data.vsTarget.map((d) => d.target),
      },
    ],
    {
      x: 0.6,
      y: 1.3,
      w: 12.1,
      h: 5.6,
      barDir: "col",
      barGrouping: "clustered",
      showLegend: true,
      legendColor: TEXT_MUTED,
      showValue: true,
      chartColors: [NEUTRAL_DARK, NEUTRAL_LIGHT],
      catAxisLabelColor: TEXT_MUTED,
      valAxisLabelColor: TEXT_MUTED,
      dataLabelColor: TEXT_DARK,
    }
  );

  // Tabel semua kunjungan — auto-paginates across slides as it overflows
  const tableSlide = pptx.addSlide();
  addHeader(tableSlide, "Tabel Kunjungan", `${data.table.length} interaksi tercatat`);
  if (data.table.length === 0) {
    addEmptyNote(tableSlide, "Belum ada kunjungan tercatat pada periode ini.");
  } else {
    const headerRow: PptxGenJSType.TableRow = [
      "No",
      "Periode",
      "Nama Stakeholder",
      "Tujuan",
      "Tipe",
      "Hasil Pembahasan",
    ].map((t) => ({
      text: t,
      options: { bold: true, color: "FFFFFF", fill: { color: NEUTRAL_DARK }, fontSize: 9 },
    }));
    const bodyRows: PptxGenJSType.TableRow[] = data.table.map((row, idx) => [
      { text: String(idx + 1), options: { fontSize: 8 } },
      { text: row.periode ? periodeFromValue(row.periode).monthLabel : "-", options: { fontSize: 8 } },
      { text: row.stakeholder_name || "-", options: { fontSize: 8 } },
      { text: row.tujuan || "-", options: { fontSize: 8 } },
      { text: row.stakeholder_type || "-", options: { fontSize: 8 } },
      { text: row.hasil_pembahasan || "-", options: { fontSize: 8 } },
    ]);
    tableSlide.addTable([headerRow, ...bodyRows], {
      x: 0.4,
      y: 1.3,
      w: 12.5,
      colW: [0.5, 1.3, 2.1, 2.1, 1.5, 5.0],
      border: { type: "solid", color: BORDER, pt: 0.5 },
      autoPage: true,
      autoPageRepeatHeader: true,
      autoPageHeaderRows: 1,
      autoPageSlideStartY: 0.6,
    });
  }

  // List Conversion periode ini
  const convSlide = pptx.addSlide();
  addHeader(convSlide, "Conversion Periode Ini", `${data.conversions.length} stakeholder`);
  if (data.conversions.length === 0) {
    addEmptyNote(convSlide, "Belum ada conversion pada periode ini.");
  } else {
    const headerRow: PptxGenJSType.TableRow = ["Nama Stakeholder", "Tipe", "Tujuan", "PIC"].map((t) => ({
      text: t,
      options: { bold: true, color: "FFFFFF", fill: { color: NEUTRAL_DARK }, fontSize: 10 },
    }));
    const rows: PptxGenJSType.TableRow[] = data.conversions.map((c) => [
      { text: c.stakeholder_name || "-", options: { fontSize: 9 } },
      { text: c.stakeholder_type || "-", options: { fontSize: 9 } },
      { text: c.tujuan || "-", options: { fontSize: 9 } },
      { text: c.pic_name || "-", options: { fontSize: 9 } },
    ]);
    convSlide.addTable([headerRow, ...rows], {
      x: 0.6,
      y: 1.3,
      w: 12.1,
      colW: [3.5, 2.5, 3.5, 2.6],
      border: { type: "solid", color: BORDER, pt: 0.5 },
    });
  }

  // List Pipeline aktif
  const pipeSlide = pptx.addSlide();
  addHeader(pipeSlide, "Pipeline Aktif", `${data.activePipeline.length} stakeholder`);
  if (data.activePipeline.length === 0) {
    addEmptyNote(pipeSlide, "Tidak ada stakeholder di pipeline aktif untuk periode ini.");
  } else {
    const headerRow: PptxGenJSType.TableRow = ["Nama Stakeholder", "Tipe", "Stage", "Potential"].map((t) => ({
      text: t,
      options: { bold: true, color: "FFFFFF", fill: { color: NEUTRAL_DARK }, fontSize: 10 },
    }));
    const rows: PptxGenJSType.TableRow[] = data.activePipeline.map((c) => [
      { text: c.stakeholder_name, options: { fontSize: 9 } },
      { text: c.stakeholder_type || "-", options: { fontSize: 9 } },
      { text: c.latest.stage_after, options: { fontSize: 9 } },
      { text: c.latest.potential_score, options: { fontSize: 9 } },
    ]);
    pipeSlide.addTable([headerRow, ...rows], {
      x: 0.6,
      y: 1.3,
      w: 12.1,
      colW: [3.8, 2.8, 2.8, 2.7],
      border: { type: "solid", color: BORDER, pt: 0.5 },
    });
  }

  await pptx.writeFile({ fileName: `Laporan-Outreach-${slugify(data.periodeLabel)}.pptx` });
}
