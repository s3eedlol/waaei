// Locked decision: horizontal pills only (grid variant dropped per README.md)
const MOODS = [
  { label: "بخير",    color: "#7fa86c" },
  { label: "قَلِق",   color: "#d0a236" },
  { label: "حزين",   color: "#5e7bbf" },
  { label: "مرهَق",  color: "#c25940" },
  { label: "متوتر",  color: "#cf8c4d" },
  { label: "متبلّد", color: "#9aa0a5" },
] as const;

export function MoodSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (i: number) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 8,
      }}
    >
      {MOODS.map((mood, i) => {
        const active = value === i;
        return (
          <button
            key={mood.label}
            onClick={() => onChange(i)}
            style={{
              display: "inline-flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
              padding: "11px 18px",
              borderRadius: "var(--waaei-radius-pill)",
              border: `1px solid ${active ? "var(--waaei-ink)" : "var(--waaei-rule)"}`,
              background: active ? "var(--waaei-ink)" : "var(--waaei-surface)",
              color: active ? "var(--waaei-bg)" : "var(--waaei-ink)",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: `background var(--waaei-motion-default), color var(--waaei-motion-default), border-color var(--waaei-motion-default)`,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: mood.color,
                flexShrink: 0,
              }}
            />
            {mood.label}
          </button>
        );
      })}
    </div>
  );
}
