import { Fragment, useMemo, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------
   OverrideMatrix

   Replaces seven separate markdown tables (identical 10-column schema,
   split only because Markdown can't express "filter by platform") with
   one filterable dataset.

   ACCESSIBILITY NOTE — this is load-bearing, not decoration:
   status red (#d03b3b) and green (#0ca30c) measure ΔE 4.1 under
   deuteranopia. Color CANNOT be the channel that distinguishes Yes from
   No. Every state therefore carries three redundant channels:
     1. a distinct icon SHAPE  (check / cross / slashed circle / triangle / dash)
     2. a visible TEXT label
     3. color, as reinforcement only
   Do not "simplify" this to colored cells.

   Written entirely against design tokens: no raw hex, no `dark:` variants.
------------------------------------------------------------------ */

type StateValue = "yes" | "no" | "never" | "conditional" | "na";

type Cell = { v: StateValue; note?: string };

type Mechanism = {
  name: string;
  platform: string;
  location: string;
  how: string;
  basedOn: string;
  states: Record<string, Cell>;
  notes: string[];
  doc: { text: string; url: string };
};

type Question = { key: string; label: string; short: string };

type Props = {
  questions: Question[];
  mechanisms: Mechanism[];
};

const STATE_META: Record<
  StateValue,
  { label: string; tone: string; icon: ReactNode }
> = {
  yes: {
    label: "Yes",
    tone: "text-good",
    icon: (
      <path
        d="M3.5 8.5l3 3 6-6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  no: {
    label: "No",
    tone: "text-critical",
    icon: (
      <path
        d="M4.5 4.5l7 7M11.5 4.5l-7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
  },
  never: {
    label: "Never",
    tone: "text-critical",
    icon: (
      <>
        <circle
          cx="8"
          cy="8"
          r="5.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M4.6 11.4l6.8-6.8"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </>
    ),
  },
  conditional: {
    label: "Conditional",
    tone: "text-warn",
    icon: (
      <>
        <path
          d="M8 2.6l5.7 10.1H2.3z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M8 6.4v3.1"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="8" cy="11.2" r="0.85" fill="currentColor" />
      </>
    ),
  },
  na: {
    label: "N/A",
    tone: "text-muted",
    icon: (
      <path
        d="M4 8h8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    ),
  },
};

function StateCell({ cell }: { cell: Cell }) {
  const meta = STATE_META[cell.v] ?? STATE_META.na;
  return (
    <div className="flex flex-col gap-0.5">
      <span className={`inline-flex items-center gap-1.5 ${meta.tone}`}>
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="h-4 w-4 shrink-0"
        >
          {meta.icon}
        </svg>
        <span className="text-sm font-medium">{meta.label}</span>
      </span>
      {cell.note && (
        <span className="text-xs leading-snug text-muted">{cell.note}</span>
      )}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
      <span className="font-medium text-ink">Legend</span>
      {(Object.keys(STATE_META) as StateValue[]).map((k) => {
        const m = STATE_META[k];
        return (
          <span key={k} className={`inline-flex items-center gap-1.5 ${m.tone}`}>
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
              {m.icon}
            </svg>
            {m.label}
          </span>
        );
      })}
    </div>
  );
}

export default function OverrideMatrix({ questions, mechanisms }: Props) {
  const [platform, setPlatform] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<string>>(new Set());

  const platforms = useMemo(
    () => ["All", ...Array.from(new Set(mechanisms.map((m) => m.platform)))],
    [mechanisms],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mechanisms.filter((m) => {
      if (platform !== "All" && m.platform !== platform) return false;
      if (!q) return true;
      return [m.name, m.location, m.how, m.basedOn, ...m.notes]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [mechanisms, platform, query]);

  const toggle = (name: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  return (
    <section className="my-8 not-prose">
      {/* filters — one row above the data, per interaction spec */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div
          role="group"
          aria-label="Filter by platform"
          className="flex flex-wrap gap-1.5"
        >
          {platforms.map((p) => {
            const active = p === platform;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                aria-pressed={active}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  active
                    ? "border-accent bg-accent-soft font-medium text-accent"
                    : "border-border text-muted hover:border-accent hover:text-ink"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search mechanisms…"
          aria-label="Search mechanisms"
          className="ml-auto min-w-52 rounded-lg border border-border bg-raised px-3 py-1.5 text-sm text-ink outline-none placeholder:text-muted focus:border-accent"
        />
      </div>

      <div className="mb-3">
        <Legend />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Microsoft Purview auto-labeling mechanisms and their label-override
            behavior
          </caption>
          <thead>
            <tr className="bg-raised">
              <th
                scope="col"
                className="border-b border-border px-3 py-2.5 text-sm font-semibold text-ink"
              >
                Mechanism
              </th>
              {questions.map((q) => (
                <th
                  key={q.key}
                  scope="col"
                  title={q.label}
                  className="border-b border-l border-border px-3 py-2.5 text-sm font-semibold text-ink"
                >
                  {q.short}
                </th>
              ))}
              <th scope="col" className="border-b border-border">
                <span className="sr-only">Details</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => {
              const isOpen = open.has(m.name);
              const panelId = `detail-${m.name.replace(/\W+/g, "-")}`;
              return (
                <Fragment key={m.name}>
                  <tr className="align-top">
                    <th
                      scope="row"
                      className="border-b border-border px-3 py-3 text-left font-medium text-ink"
                    >
                      <span className="block text-sm">{m.name}</span>
                      <span className="mt-0.5 block text-xs font-normal text-muted">
                        {m.location}
                      </span>
                    </th>
                    {questions.map((q) => (
                      <td
                        key={q.key}
                        className="border-b border-l border-border px-3 py-3"
                      >
                        <StateCell cell={m.states[q.key] ?? { v: "na" }} />
                      </td>
                    ))}
                    <td className="border-b border-border px-2 py-3">
                      <button
                        type="button"
                        onClick={() => toggle(m.name)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="rounded-md border border-border px-2 py-1 text-xs text-muted hover:border-accent hover:text-accent"
                      >
                        {isOpen ? "Hide" : "Details"}
                      </button>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr id={panelId}>
                      <td
                        colSpan={questions.length + 2}
                        className="border-b border-border bg-raised px-4 py-4"
                      >
                        <dl className="grid gap-3 text-sm sm:grid-cols-2">
                          <div>
                            <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
                              How it works
                            </dt>
                            <dd className="mt-1 text-ink">{m.how}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
                              Based on
                            </dt>
                            <dd className="mt-1 text-ink">{m.basedOn}</dd>
                          </div>
                        </dl>
                        <div className="mt-3">
                          <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                            Key notes
                          </p>
                          <ul className="mt-1 list-disc pl-5 text-sm text-ink">
                            {m.notes.map((n) => (
                              <li key={n} className="my-0.5">
                                {n}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <a
                          href={m.doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-block text-sm text-accent underline underline-offset-2"
                        >
                          {m.doc.text} →
                        </a>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={questions.length + 2}
                  className="px-3 py-8 text-center text-sm text-muted"
                >
                  No mechanisms match those filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-xs text-muted">
        Showing {rows.length} of {mechanisms.length} mechanisms
        {platform !== "All" && ` · ${platform}`}
      </p>
    </section>
  );
}
