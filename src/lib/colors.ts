import type { PotentialScore, Stage } from "./types";

/**
 * Color is used functionally only — to encode potential score and pipeline
 * stage at a glance. Everything else in the UI stays neutral.
 */
export const POTENTIAL_SCORE_STYLE: Record<
  PotentialScore,
  { emoji: string; badge: string; dot: string }
> = {
  Hot: {
    emoji: "🔥",
    badge: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
  },
  Warm: {
    emoji: "🟡",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
  },
  Cold: {
    emoji: "❄️",
    badge: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
  },
};

export const STAGE_STYLE: Record<
  Stage,
  { badge: string; accent: string; dot: string }
> = {
  Passive: {
    badge: "bg-gray-100 text-gray-600 border border-gray-200",
    accent: "border-t-gray-400",
    dot: "bg-gray-400",
  },
  Lead: {
    badge: "bg-sky-50 text-sky-700 border border-sky-200",
    accent: "border-t-sky-400",
    dot: "bg-sky-500",
  },
  Contacted: {
    badge: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    accent: "border-t-indigo-400",
    dot: "bg-indigo-500",
  },
  Meeting: {
    badge: "bg-violet-50 text-violet-700 border border-violet-200",
    accent: "border-t-violet-400",
    dot: "bg-violet-500",
  },
  "Proposal Sent": {
    badge: "bg-orange-50 text-orange-700 border border-orange-200",
    accent: "border-t-orange-400",
    dot: "bg-orange-500",
  },
  Consideration: {
    badge: "bg-teal-50 text-teal-700 border border-teal-200",
    accent: "border-t-teal-400",
    dot: "bg-teal-500",
  },
  Conversion: {
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    accent: "border-t-emerald-400",
    dot: "bg-emerald-500",
  },
};

/** Hex equivalents of the stage/score accent colors above, for chart fills (SVG can't use Tailwind classes). */
export const STAGE_HEX: Record<Stage, string> = {
  Passive: "#9ca3af",
  Lead: "#0ea5e9",
  Contacted: "#6366f1",
  Meeting: "#8b5cf6",
  "Proposal Sent": "#f97316",
  Consideration: "#14b8a6",
  Conversion: "#10b981",
};

export const SCORE_HEX: Record<PotentialScore, string> = {
  Hot: "#ef4444",
  Warm: "#f59e0b",
  Cold: "#94a3b8",
};

/** Neutral chart colors — used for series that aren't score/stage-coded. */
export const CHART_NEUTRAL = {
  primary: "#111827", // gray-900
  secondary: "#d1d5db", // gray-300
  grid: "#e5e7eb", // gray-200
  muted: "#9ca3af", // gray-400
};
