"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  PROJECT_STREAK_DATA,
  type GitHubContributionProfile,
  type ProjectBuildStage,
  type ProjectDailyEntry,
  type SingleProjectStreakData,
} from "./project-streak-data";

export type StreakLevel = 0 | 1 | 2 | 3 | 4;
export type BuildCategory = ProjectBuildStage["category"];

export interface StreakDayCell {
  date: string;
  monthShort: string;
  dayOfMonth: number;
  count: number;
  level: StreakLevel;
  category: BuildCategory;
  title: string;
  note: string;
  ideas: string[];
}

export interface StreakGridProps {
  days: StreakDayCell[];
  totalActivities: number;
  summaryLabel?: string;
  githubProfile?: GitHubContributionProfile | null;
  highlightCategory?: BuildCategory | "all";
  onSelectDay?: (day: StreakDayCell) => void;
  selectedDate?: string | null;
  className?: string;
}

/**
 * 5-tier Phosphor-Emerald on Warm-Paper Found Theme (#FDFDFC / #FFFFFF).
 * Empty: #F0EFEA, Level 1: #DCFCE7, Level 2: #86EFAC, Level 3: #22C55E, Level 4: #15803D.
 */
const BUNUI_LEVEL_COLORS: Record<StreakLevel, string> = {
  0: "#F0EFEA", // warm paper empty cell
  1: "#DCFCE7", // light mint
  2: "#86EFAC", // soft emerald
  3: "#22C55E", // vibrant green
  4: "#15803D", // deep phosphor forest
};

const ASCII_LEVEL_GLYPHS: Record<StreakLevel, string> = {
  0: "·",
  1: "░",
  2: "▒",
  3: "▓",
  4: "█",
};

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const CATEGORY_LABELS: Record<BuildCategory, string> = {
  architecture: "Spec & Checkpoints",
  rust_core: "Core Engine",
  ai_agents: "AI & Interaction",
  spatial_ui: "UI & 3D Arena",
  qa_verify: "13-Point QA Gate",
  ship_demo: "Daily Sync & Ideas",
};

const ALL_CATEGORIES: BuildCategory[] = [
  "architecture",
  "rust_core",
  "ai_agents",
  "spatial_ui",
  "qa_verify",
  "ship_demo",
];

function toLevel(count: number): StreakLevel {
  if (count <= 0) return 0;
  if (count <= 3) return 1;
  if (count <= 12) return 2;
  if (count <= 28) return 3;
  return 4;
}

export function buildSingleProjectStreakYear(
  project: SingleProjectStreakData,
  extraLocalIdeas: ProjectDailyEntry[],
  anchorIsoDate?: string,
): { days: StreakDayCell[]; totalActivities: number } {
  const stageNotes = project.buildStages.reduce(
    (acc, stage) => {
      acc[stage.category] = {
        title: `${project.projectName} · ${stage.phase}`,
        note: stage.outcome,
      };
      return acc;
    },
    {
      architecture: {
        title: `${project.projectName} · Architecture & Spec`,
        note: "Competition constraints, design checkpoints & milestone planning",
      },
      rust_core: {
        title: `${project.projectName} · Core Engine`,
        note: "Deterministic runtime logic, state transitions & safety guards",
      },
      ai_agents: {
        title: `${project.projectName} · Agentic & Interactive Loop`,
        note: "Core interactive loop & tool integration",
      },
      spatial_ui: {
        title: `${project.projectName} · 3-Variant UI Arena`,
        note: "Interactive UI variants, shaders & responsive layout polish",
      },
      qa_verify: {
        title: `${project.projectName} · Adversarial QA`,
        note: "End-to-end Playwright verification, stress checks & 0px overflow",
      },
      ship_demo: {
        title: `${project.projectName} · Daily Automation & Ideas`,
        note: "Daily 14:00 progress check, idea capture & demo preparation",
      },
    } as Record<BuildCategory, { title: string; note: string }>,
  );

  const entryByDate = new Map<string, ProjectDailyEntry>();
  for (const entry of project.dailyEntries) {
    entryByDate.set(entry.date, {
      ...entry,
      ideas: [...(entry.ideas || [])],
    });
  }
  for (const local of extraLocalIdeas) {
    const existing = entryByDate.get(local.date);
    if (existing) {
      existing.count += local.count;
      existing.ideas = [...local.ideas, ...existing.ideas];
      existing.note = local.note || existing.note;
    } else {
      entryByDate.set(local.date, { ...local });
    }
  }

  // 1. REAL GITHUB CONTRIBUTION CALENDAR (@harrymove-ctrl)
  const ghProfile = project.githubContributions;
  if (ghProfile && Array.isArray(ghProfile.days) && ghProfile.days.length > 0) {
    const extraCountSum = extraLocalIdeas.reduce(
      (acc, item) => acc + item.count,
      0,
    );
    const sortedGh = [...ghProfile.days].sort((a, b) =>
      a.date.localeCompare(b.date),
    );
    const windowed = sortedGh.slice(-371);

    const days: StreakDayCell[] = windowed.map((ghDay, idx) => {
      const dt = new Date(`${ghDay.date}T00:00:00Z`);
      const logged = entryByDate.get(ghDay.date);

      const catIdx = idx % ALL_CATEGORIES.length;
      const fallbackCat = ALL_CATEGORIES[catIdx] ?? "ship_demo";
      const cat = logged ? logged.category : fallbackCat;
      const fallbackMeta = stageNotes[cat];

      const effectiveCount = logged
        ? ghDay.count + logged.count
        : ghDay.count;

      return {
        date: ghDay.date,
        monthShort: MONTH_NAMES[dt.getUTCMonth()]!,
        dayOfMonth: dt.getUTCDate(),
        count: effectiveCount,
        level: toLevel(effectiveCount),
        category: cat,
        title: logged
          ? logged.title
          : `${project.projectName} · ${fallbackMeta.title}`,
        note: logged ? logged.note : fallbackMeta.note,
        ideas: logged ? logged.ideas : [],
      };
    });

    const totalFromDays = days.reduce((acc, d) => acc + d.count, 0);
    return {
      days,
      totalActivities: Math.max(ghProfile.totalContributions + extraCountSum, totalFromDays),
    };
  }

  // Fallback 53-week deterministic generation
  const today = anchorIsoDate
    ? new Date(`${anchorIsoDate}T00:00:00Z`)
    : new Date();
  const dayOfWeek = today.getUTCDay();
  const totalDays = 52 * 7 + (dayOfWeek + 1);
  const startDate = new Date(today);
  startDate.setUTCDate(today.getUTCDate() - (totalDays - 1));

  let runningTotal = 0;
  const days: StreakDayCell[] = Array.from({ length: totalDays }, (_, i) => {
    const dt = new Date(startDate);
    dt.setUTCDate(startDate.getUTCDate() + i);
    const iso = dt.toISOString().slice(0, 10);
    const logged = entryByDate.get(iso);

    const count = logged ? logged.count : 2;
    runningTotal += count;

    const catIdx = i % ALL_CATEGORIES.length;
    const fallbackCat = ALL_CATEGORIES[catIdx] ?? "ship_demo";
    const cat = logged ? logged.category : fallbackCat;
    const fallbackMeta = stageNotes[cat];

    return {
      date: iso,
      monthShort: MONTH_NAMES[dt.getUTCMonth()]!,
      dayOfMonth: dt.getUTCDate(),
      count,
      level: toLevel(count),
      category: cat,
      title: logged ? logged.title : fallbackMeta.title,
      note: logged ? logged.note : fallbackMeta.note,
      ideas: logged ? logged.ideas : [],
    };
  });

  return { days, totalActivities: runningTotal };
}

/* ============================================================================
   TACTILE CARD HELPERS (MDXCN DASHER, DITHER SPOTLIGHT, BENCHO TILT)
   ============================================================================ */

function StreakBayerDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="streak-bayer-subtle"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.12"
            shapeRendering="crispEdges"
          />
          <rect
            x="4"
            y="4"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.12"
            shapeRendering="crispEdges"
          />
        </pattern>
        <pattern
          id="streak-bayer-green"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width="2"
            height="2"
            fill="#16A34A"
            opacity="0.75"
            shapeRendering="crispEdges"
          />
          <rect
            x="4"
            y="4"
            width="2"
            height="2"
            fill="#16A34A"
            opacity="0.75"
            shapeRendering="crispEdges"
          />
          <rect
            x="2"
            y="2"
            width="2"
            height="2"
            fill="#16A34A"
            opacity="0.4"
            shapeRendering="crispEdges"
          />
        </pattern>
      </defs>
    </svg>
  );
}

function MiniTiltCard({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState("none");

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotX = -((y / rect.height - 0.5) * 2) * 3;
    const rotY = ((x / rect.width - 0.5) * 2) * 3;
    setTransform(`perspective(700px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`);
  };

  const handlePointerLeave = () => {
    setTransform("none");
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      style={{
        transform,
        transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

function MiniProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full border border-[var(--line,#E8E6E1)] bg-[var(--soft,#F3F3F1)]">
      <div
        className="h-full bg-[var(--ok,#2D6A4F)] transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/**
 * Pixel-faithful BunUI Streak Grid on Found Warm-Paper Theme
 * with Bayer Halftone Textures and [ HEATMAP | ASCII ] Toggle.
 */
export function StreakGrid({
  days,
  totalActivities,
  summaryLabel = "GitHub contributions in the last year",
  githubProfile,
  highlightCategory = "all",
  onSelectDay,
  selectedDate,
  className = "",
}: StreakGridProps) {
  const [formatMode, setFormatMode] = useState<"heatmap" | "ascii">("heatmap");
  const [copiedAscii, setCopiedAscii] = useState(false);

  const weeks = useMemo(() => {
    const cols: StreakDayCell[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      cols.push(days.slice(i, i + 7));
    }
    return cols;
  }, [days]);

  const monthByCol = useMemo(() => {
    const map = new Map<number, string>();
    let lastMonth = "";
    let lastPlacedCol = -4;

    weeks.forEach((week, colIndex) => {
      const firstOfMonth = week.find((d) => d.dayOfMonth <= 7) ?? week[0];
      if (!firstOfMonth) return;
      if (firstOfMonth.monthShort !== lastMonth) {
        if (colIndex - lastPlacedCol >= 3) {
          map.set(colIndex, firstOfMonth.monthShort);
          lastPlacedCol = colIndex;
        }
        lastMonth = firstOfMonth.monthShort;
      }
    });
    return map;
  }, [weeks]);

  // Generate copyable ASCII 53-week contribution calendar
  const asciiCalendar = useMemo(() => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const rows = [0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
      const label = dayNames[dayIdx]!;
      const rowGlyphs = weeks
        .map((w) => {
          const cell = w[dayIdx];
          return cell ? ASCII_LEVEL_GLYPHS[cell.level] : " ";
        })
        .join("");
      return `|  ${label}  ${rowGlyphs}  |`;
    });

    return [
      "+-----------------------------------------------------------------------------------------------+",
      `|  GITHUB 53-WEEK CONTRIBUTION CALENDAR: @harrymove-ctrl (${totalActivities.toLocaleString()} Contributions)             |`,
      "|  Legend: · Empty  ░ Level 1  ▒ Level 2  ▓ Level 3  █ Level 4                                  |",
      "+-----------------------------------------------------------------------------------------------+",
      ...rows,
      "+-----------------------------------------------------------------------------------------------+",
    ].join("\n");
  }, [weeks, totalActivities]);

  const handleCopyAscii = async () => {
    try {
      await navigator.clipboard.writeText(asciiCalendar);
      setCopiedAscii(true);
      setTimeout(() => setCopiedAscii(false), 1800);
    } catch {
      // Ignore clipboard restrictions
    }
  };

  return (
    <div
      data-testid="bunui-streak-grid"
      className={`relative rounded-2xl border border-[var(--line,#E8E6E1)] bg-[var(--surface,#FFFFFF)] p-4 text-[var(--ink,#141413)] sm:p-5 ${className}`}
    >
      <StreakBayerDefs />

      {/* Clean Header Row with [ HEATMAP | ASCII ] Toggle */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line,#E8E6E1)] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] font-semibold text-[var(--ink,#141413)]">
            GitHub Contribution Activity · 53 Weeks
          </span>
        </div>

        {/* [ HEATMAP | ASCII ] Format Toggle */}
        <div
          role="group"
          aria-label="Streak grid presentation format"
          className="flex items-center rounded-lg border border-[var(--line,#E8E6E1)] bg-[var(--soft,#F3F3F1)] p-0.5 font-mono text-[10.5px]"
        >
          <button
            type="button"
            onClick={() => setFormatMode("heatmap")}
            className={`rounded px-2.5 py-0.5 font-semibold transition cursor-pointer ${
              formatMode === "heatmap"
                ? "bg-[var(--surface,#FFFFFF)] text-[var(--ink,#141413)] shadow-xs"
                : "text-[var(--muted,#838380)] hover:text-[var(--ink,#141413)]"
            }`}
          >
            HEATMAP
          </button>
          <button
            type="button"
            onClick={() => setFormatMode("ascii")}
            className={`rounded px-2.5 py-0.5 font-semibold transition cursor-pointer ${
              formatMode === "ascii"
                ? "bg-[var(--ink,#141413)] text-[var(--bg,#FDFDFC)] shadow-xs"
                : "text-[var(--muted,#838380)] hover:text-[var(--ink,#141413)]"
            }`}
          >
            ASCII
          </button>
        </div>
      </div>

      {formatMode === "heatmap" ? (
        <div className="w-full overflow-x-auto pb-2">
          <div className="inline-block min-w-max">
            {/* Month Header Row */}
            <div
              aria-hidden="true"
              className="mb-2 grid grid-flow-col auto-cols-[13px] gap-[4px] font-mono text-[11px] text-[var(--muted,#838380)]"
            >
              {weeks.map((_, colIdx) => (
                <div
                  key={`month-col-${colIdx}`}
                  className="relative h-4 overflow-visible"
                >
                  {monthByCol.has(colIdx) ? (
                    <span className="absolute top-0 left-0 whitespace-nowrap">
                      {monthByCol.get(colIdx)}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            {/* 7 x 53 Warm-Paper Phosphor Emerald Matrix */}
            <div
              role="grid"
              aria-label={`${PROJECT_STREAK_DATA.projectName} yearly GitHub contribution streak grid`}
              className="grid grid-flow-col auto-cols-[13px] gap-[4px]"
            >
              {weeks.map((week, colIdx) => (
                <div
                  key={`week-${colIdx}`}
                  role="row"
                  className="grid grid-rows-7 gap-[4px]"
                >
                  {week.map((day) => {
                    const matchesFilter =
                      highlightCategory === "all" ||
                      day.category === highlightCategory;
                    const effectiveLevel: StreakLevel =
                      highlightCategory !== "all" &&
                      matchesFilter &&
                      day.count > 0
                        ? 4
                        : day.level;
                    const isSelected = selectedDate === day.date;

                    return (
                      <button
                        key={day.date}
                        type="button"
                        role="gridcell"
                        data-testid={`streak-cell-${day.date}`}
                        aria-label={`${day.date}: ${day.count} contributions, ${CATEGORY_LABELS[day.category]}`}
                        onMouseEnter={() => onSelectDay?.(day)}
                        onFocus={() => onSelectDay?.(day)}
                        onClick={() => onSelectDay?.(day)}
                        style={{
                          backgroundColor: BUNUI_LEVEL_COLORS[effectiveLevel],
                          opacity: matchesFilter ? 1 : 0.22,
                        }}
                        className={`h-[13px] w-[13px] rounded-[3px] border border-[var(--line,#E8E6E1)] transition-transform duration-150 hover:z-10 hover:scale-125 focus-visible:z-10 focus-visible:scale-125 focus-visible:outline-2 focus-visible:outline-[var(--ok,#2D6A4F)] ${
                          isSelected
                            ? "ring-2 ring-[var(--ink,#141413)] ring-offset-1"
                            : ""
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg border border-[var(--line,#E8E6E1)] bg-[var(--soft,#F3F3F1)] p-3">
          <div className="absolute top-2.5 right-2.5">
            <button
              type="button"
              onClick={() => void handleCopyAscii()}
              className="rounded border border-[var(--line,#E8E6E1)] bg-[var(--surface,#FFFFFF)] px-2.5 py-1 font-mono text-[10.5px] font-bold text-[var(--ink,#141413)] shadow-xs hover:bg-[var(--soft,#F3F3F1)] cursor-pointer"
            >
              {copiedAscii ? "COPIED ASCII" : "COPY ASCII GRID"}
            </button>
          </div>
          <pre className="overflow-x-auto font-mono text-[10.5px] leading-tight text-[var(--ink,#141413)] select-all">
            {asciiCalendar}
          </pre>
        </div>
      )}

      {/* Bottom Summary & Real GitHub Profile Breakdown */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-[var(--line,#E8E6E1)] pt-3 text-[12.5px]">
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="text-[var(--muted,#838380)] tabular-nums">
            <strong
              data-testid="streak-total-count"
              className="font-mono font-bold text-[var(--ink,#141413)]"
            >
              {totalActivities.toLocaleString("en-US")}
            </strong>{" "}
            {summaryLabel}
          </p>

          {githubProfile ? (
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-[var(--muted,#838380)]">
              <a
                href={githubProfile.url}
                target="_blank"
                rel="noreferrer"
                data-testid="github-profile-link"
                className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-semibold text-[var(--ok,#2D6A4F)] hover:bg-emerald-500/20"
              >
                @{githubProfile.login}
              </a>
              <span className="rounded-md border border-[var(--line,#E8E6E1)] bg-[var(--soft,#F3F3F1)] px-2 py-0.5 text-[var(--ink,#141413)]">
                {githubProfile.commits} Commits
              </span>
              <span className="rounded-md border border-[var(--line,#E8E6E1)] bg-[var(--soft,#F3F3F1)] px-2 py-0.5 text-[var(--ink,#141413)]">
                {githubProfile.pullRequests} PRs
              </span>
              <span className="rounded-md border border-[var(--line,#E8E6E1)] bg-[var(--soft,#F3F3F1)] px-2 py-0.5 text-[var(--ink,#141413)]">
                {githubProfile.reviews} Reviews
              </span>
              <span className="rounded-md border border-[var(--line,#E8E6E1)] bg-[var(--soft,#F3F3F1)] px-2 py-0.5 text-[var(--ink,#141413)]">
                {githubProfile.issues} Issues
              </span>
            </div>
          ) : null}
        </div>

        <div
          aria-label="Activity intensity legend from less to more"
          className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--muted,#838380)]"
        >
          <span className="mr-0.5">Less</span>
          {([0, 1, 2, 3, 4] as StreakLevel[]).map((lvl) => (
            <span
              key={`legend-${lvl}`}
              style={{ backgroundColor: BUNUI_LEVEL_COLORS[lvl] }}
              className="inline-block h-[11px] w-[11px] rounded-[2.5px] border border-[var(--line,#E8E6E1)]"
            />
          ))}
          <span className="ml-0.5">More</span>
        </div>
      </div>
    </div>
  );
}

export interface ProjectImpactStreakSectionProps {
  defaultHackathonId?: string;
  heading?: string;
}

type StreakViewVariant = "impact_split" | "pure_bunui" | "daily_ideas";

/**
 * Isolated single-project BunUI Streak Grid + "What I Impact & How I Build" + Daily Idea Log.
 * Upgraded to warm-paper Found theme with mdxcn.dev dashed frames, dithercn Bayer halftones,
 * and bencho.dev liquid physics & 3D tilt.
 */
export function ProjectImpactStreakSection({
  heading = "Project Impact & How I Build",
}: ProjectImpactStreakSectionProps) {
  const project = PROJECT_STREAK_DATA;
  const storageKey = `bunui_streak_ideas_${project.projectId}`;

  const [viewVariant, setViewVariant] =
    useState<StreakViewVariant>("impact_split");
  const [activeCategory, setActiveCategory] = useState<BuildCategory | "all">(
    "all",
  );
  const [inspectedDay, setInspectedDay] = useState<StreakDayCell | null>(null);

  const [localIdeas, setLocalIdeas] = useState<ProjectDailyEntry[]>([]);
  const [ideaDraft, setIdeaDraft] = useState("");
  const [noteCategory, setNoteCategory] = useState<BuildCategory>("ship_demo");
  const [copiedCli, setCopiedCli] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as ProjectDailyEntry[];
        if (Array.isArray(parsed)) setLocalIdeas(parsed);
      }
    } catch {
      // Ignore storage errors
    }
  }, [storageKey]);

  const { days, totalActivities } = useMemo(
    () => buildSingleProjectStreakYear(project, localIdeas),
    [project, localIdeas],
  );

  const currentDay =
    inspectedDay ??
    [...days].reverse().find((d) => d.count > 0) ??
    days[days.length - 1] ??
    null;

  const mergedDailyFeed = useMemo(() => {
    const byDate = new Map<string, ProjectDailyEntry>();
    for (const item of project.dailyEntries) {
      byDate.set(item.date, { ...item, ideas: [...(item.ideas || [])] });
    }
    for (const extra of localIdeas) {
      const found = byDate.get(extra.date);
      if (found) {
        found.count += extra.count;
        found.ideas = [...extra.ideas, ...found.ideas];
      } else {
        byDate.set(extra.date, { ...extra });
      }
    }
    return Array.from(byDate.values()).sort((a, b) =>
      b.date.localeCompare(a.date),
    );
  }, [localIdeas, project.dailyEntries]);

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = ideaDraft.trim();
    if (!trimmed) return;
    const todayIso =
      days[days.length - 1]?.date || new Date().toISOString().slice(0, 10);
    const nextEntry: ProjectDailyEntry = {
      date: todayIso,
      count: 3,
      category: noteCategory,
      title: `${project.projectName} · Idea & Daily Update`,
      note: trimmed,
      ideas: [trimmed],
    };
    const updated = [nextEntry, ...localIdeas];
    setLocalIdeas(updated);
    setIdeaDraft("");
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // Ignore storage write errors
    }
  };

  const handleCopySyncCommand = async () => {
    const sampleIdea =
      ideaDraft.trim() || "New gameplay or architecture improvement";
    const cmd = `node /Volumes/Dev/shared/bunui-streak-grid/update-project-streak.mjs --project "${project.projectDir}" --idea "${sampleIdea.replace(/"/g, '\\"')}"`;
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
    } catch {
      // Clipboard may be restricted in headless contexts
    }
  };

  return (
    <section
      id="impact-streak"
      data-testid="hackathon-impact-streak-section"
      aria-labelledby="impact-streak-heading"
      className="relative mt-10 scroll-mt-24 border-t border-[var(--line,#E8E6E1)] pt-8 text-[var(--ink,#141413)]"
    >
      {/* Clean Header Row & 3-Mode Switcher */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            {project.githubContributions ? (
              <a
                href={project.githubContributions.url}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[11.5px] font-medium text-[var(--ok,#2D6A4F)] hover:underline"
              >
                GitHub @{project.githubContributions.login}
              </a>
            ) : null}
            <span className="text-[11.5px] text-[var(--muted,#838380)]">
              · {project.competitionBadge}
            </span>
          </div>
          <h2
            id="impact-streak-heading"
            className="text-lg font-semibold tracking-tight text-[var(--ink,#141413)]"
          >
            {heading}
          </h2>
          <p className="max-w-2xl text-[12.5px] text-[var(--muted,#838380)]">
            {project.impactSummary}
          </p>
        </div>

        {/* 3 Single-Project View Modes in Warm-Paper Segmented Control */}
        <div
          role="group"
          aria-label="Project streak display mode"
          className="found-ctxsw shrink-0"
        >
          {(
            [
              { id: "impact_split", label: "Impact + Build" },
              { id: "pure_bunui", label: "Pure Streak" },
              { id: "daily_ideas", label: "Daily Ideas & Log" },
            ] as const
          ).map((mode) => (
            <button
              key={mode.id}
              type="button"
              data-testid={`streak-mode-${mode.id}`}
              onClick={() => setViewVariant(mode.id)}
              aria-pressed={viewVariant === mode.id}
              className={viewVariant === mode.id ? "on" : ""}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Core BunUI Streak Grid Canvas */}
      <div className="mt-4">
        <StreakGrid
          days={days}
          totalActivities={totalActivities}
          summaryLabel="GitHub contributions in the last year"
          githubProfile={project.githubContributions}
          highlightCategory={activeCategory}
          selectedDate={currentDay?.date ?? null}
          onSelectDay={setInspectedDay}
        />

        {/* Inline Day & Idea Readout on Found Warm Paper */}
        {currentDay && viewVariant !== "pure_bunui" ? (
          <div
            data-testid="streak-day-inspector"
            className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--line,#E8E6E1)] bg-[var(--surface,#FFFFFF)] px-4 py-2.5 text-xs"
          >
            <div className="flex min-w-0 flex-wrap items-center gap-2.5">
              <span className="font-mono font-semibold text-[var(--ink,#141413)] tabular-nums">
                {currentDay.date}
              </span>
              <span className="text-[var(--muted,#838380)] tabular-nums">
                {currentDay.count}{" "}
                {currentDay.count === 1 ? "contribution" : "contributions"}
              </span>
              <span className="font-mono text-[11px] font-medium text-[var(--ok,#2D6A4F)]">
                · {CATEGORY_LABELS[currentDay.category]}
              </span>
              <span className="min-w-0 truncate text-[var(--muted,#838380)]">
                · {currentDay.ideas[0]
                  ? `Idea: ${currentDay.ideas[0]}`
                  : currentDay.note}
              </span>
            </div>

            {activeCategory !== "all" ? (
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className="shrink-0 font-mono text-[11px] font-medium text-[var(--ink,#141413)] underline cursor-pointer"
              >
                Clear Filter
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Mode 1: What I Impact (4 Clean Cards) + How I Build Pipeline (3x2 Grid) */}
      {viewVariant === "impact_split" ? (
        <div className="mt-5 space-y-5">
          {/* Top Row: 4 Clean Equal-Height Impact Cards */}
          <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {project.impactMetrics.map((metric) => (
              <MiniTiltCard key={metric.label}>
                <article className="flex h-full min-h-[116px] flex-col justify-between rounded-xl border border-[var(--line,#E8E6E1)] bg-[var(--surface,#FFFFFF)] p-4">
                  <div>
                    <p className="text-[11.5px] font-medium text-[var(--muted,#838380)]">
                      {metric.label}
                    </p>
                    <p className="mt-1 font-mono text-[19px] font-semibold tracking-tight text-[var(--ink,#141413)] tabular-nums">
                      {metric.value}
                    </p>
                  </div>
                  <p className="mt-2 text-[11.5px] leading-snug text-[var(--muted,#838380)]">
                    {metric.detail}
                  </p>
                </article>
              </MiniTiltCard>
            ))}
          </div>

          {/* Bottom Grid: 6 Clean Build Stages in a Balanced 3x2 Grid */}
          <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {project.buildStages.map((stage) => {
              const selected = activeCategory === stage.category;
              return (
                <MiniTiltCard key={`${stage.step}-${stage.phase}`}>
                  <button
                    type="button"
                    data-testid={`build-stage-${stage.category}`}
                    onClick={() =>
                      setActiveCategory((prev) =>
                        prev === stage.category ? "all" : stage.category,
                      )
                    }
                    aria-pressed={selected}
                    className={`w-full flex h-full min-h-[108px] flex-col justify-between rounded-xl border p-4 text-left transition cursor-pointer ${
                      selected
                        ? "border-[var(--ink,#141413)] bg-[var(--soft,#F3F3F1)]"
                        : "border-[var(--line,#E8E6E1)] bg-[var(--surface,#FFFFFF)] hover:bg-[var(--soft,#F3F3F1)]/60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[13px] font-semibold text-[var(--ink,#141413)]">
                          {stage.step}. {stage.phase}
                        </span>
                        <span className="font-mono text-[10.5px] text-[var(--muted,#838380)]">
                          {stage.tool}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-[12px] leading-snug text-[var(--muted,#838380)]">
                      {stage.outcome}
                    </p>
                  </button>
                </MiniTiltCard>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Mode 3: Daily Automation & Ideas Feed */}
      {viewVariant === "daily_ideas" ? (
        <div
          data-testid="project-daily-ideas-panel"
          className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-12"
        >
          <form
            onSubmit={handleAddIdea}
            className="space-y-4 rounded-xl border border-dashed border-[var(--line-strong,#D5D2CA)] bg-[var(--surface,#FFFFFF)] p-5 lg:col-span-5 shadow-sm"
          >
            <div>
              <h3 className="font-mono text-xs font-bold tracking-wider text-[var(--ok,#2D6A4F)] uppercase">
                [ ADD DAILY IDEA OR BUILD UPDATE ]
              </h3>
              <p className="mt-1 text-xs text-[var(--muted,#838380)]">
                Capture new ideas for {project.projectName}. Daily 14:00 automation also syncs streak-log.json automatically.
              </p>
            </div>

            <label className="block space-y-1.5 text-xs font-medium text-[var(--ink,#141413)]">
              <span>Stage Category</span>
              <select
                value={noteCategory}
                onChange={(e) =>
                  setNoteCategory(e.target.value as BuildCategory)
                }
                className="min-h-10 w-full rounded-lg border border-[var(--line,#E8E6E1)] bg-[var(--soft,#F3F3F1)] px-3 text-xs text-[var(--ink,#141413)] font-mono"
              >
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5 text-xs font-medium text-[var(--ink,#141413)]">
              <span>Idea or Milestone Note</span>
              <textarea
                rows={3}
                data-testid="idea-input"
                placeholder={`Add next idea for ${project.projectName}...`}
                value={ideaDraft}
                onChange={(e) => setIdeaDraft(e.target.value)}
                className="w-full rounded-lg border border-[var(--line,#E8E6E1)] bg-[var(--soft,#F3F3F1)] p-3 text-xs text-[var(--ink,#141413)]"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="submit"
                data-testid="add-idea-btn"
                className="min-h-10 flex-1 rounded-lg bg-[var(--ink,#141413)] px-4 py-2 font-mono text-xs font-bold text-[var(--bg,#FDFDFC)] transition hover:opacity-90 cursor-pointer"
              >
                Log Idea to Today&apos;s Streak
              </button>
              <button
                type="button"
                onClick={() => void handleCopySyncCommand()}
                className="min-h-10 rounded-lg border border-[var(--line,#E8E6E1)] bg-[var(--soft,#F3F3F1)] px-3 py-2 font-mono text-[11px] font-semibold text-[var(--ink,#141413)] hover:bg-[var(--surface,#FFFFFF)] cursor-pointer"
              >
                {copiedCli ? "Copied CLI" : "Copy CLI Sync"}
              </button>
            </div>
          </form>

          <div className="space-y-3 lg:col-span-7">
            <h3 className="font-mono text-xs font-bold tracking-wider text-[var(--ok,#2D6A4F)] uppercase">
              [ DAILY AUTOMATION &amp; IDEA TIMELINE · {mergedDailyFeed.length} DAYS LOGGED ]
            </h3>
            {mergedDailyFeed.map((entry) => (
              <article
                key={`${entry.date}-${entry.title}`}
                className="relative rounded-xl border border-dashed border-[var(--line-strong,#D5D2CA)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm"
              >
                {/* Corner crosshairs (+) */}
                <span className="pointer-events-none absolute -top-[6px] -left-[4px] select-none font-mono text-[10px] font-bold text-[var(--muted,#838380)]">
                  +
                </span>
                <span className="pointer-events-none absolute -top-[6px] -right-[4px] select-none font-mono text-[10px] font-bold text-[var(--muted,#838380)]">
                  +
                </span>
                <span className="pointer-events-none absolute -bottom-[6px] -left-[4px] select-none font-mono text-[10px] font-bold text-[var(--muted,#838380)]">
                  +
                </span>
                <span className="pointer-events-none absolute -bottom-[6px] -right-[4px] select-none font-mono text-[10px] font-bold text-[var(--muted,#838380)]">
                  +
                </span>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--ok,#2D6A4F)] tabular-nums">
                    {entry.date} · {entry.title}
                  </span>
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-[var(--ok,#2D6A4F)] tabular-nums">
                    +{entry.count} streak
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted,#838380)]">
                  {entry.note}
                </p>
                {entry.ideas && entry.ideas.length > 0 ? (
                  <ul className="mt-2.5 space-y-1 border-t border-dashed border-[var(--line,#E8E6E1)] pt-2 text-xs text-[var(--ink,#141413)] font-medium">
                    {entry.ideas.map((idea, idx) => (
                      <li
                        key={`${entry.date}-idea-${idx}`}
                        className="flex items-start gap-2"
                      >
                        <span className="font-mono text-[var(--ok,#2D6A4F)] font-bold">
                          *
                        </span>
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

/** Alias preserved so existing imports remain 100% compatible. */
export const HackathonImpactStreakSection = ProjectImpactStreakSection;
