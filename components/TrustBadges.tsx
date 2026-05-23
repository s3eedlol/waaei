export interface TrustBadgeItem {
  emoji: string;
  label: string;
}

export function TrustBadges({
  items,
  size = "sm",
}: {
  items: TrustBadgeItem[];
  size?: "sm" | "md";
}) {
  const isMd = size === "md";
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map((item) => (
        <span
          key={item.label}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
            padding: isMd ? "8px 14px" : "6px 12px",
            background: "var(--waaei-surface)",
            border: "1px solid var(--waaei-rule)",
            borderRadius: "var(--waaei-radius-pill)",
            fontSize: isMd ? 13 : 11,
            fontWeight: 600,
            color: "var(--waaei-ink)",
          }}
        >
          <span style={{ fontSize: isMd ? 14 : 13 }}>{item.emoji}</span>
          {item.label}
        </span>
      ))}
    </div>
  );
}
