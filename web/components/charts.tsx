// Tiny pure-SVG charts (DEC-021) — token-colored, no chart dependency.

export function ProgressRing({
  value,
  size = 96,
  label,
}: {
  value: number; // 0..1
  size?: number;
  label?: string;
}) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value));
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label ?? `${Math.round(pct * 100)}% complete`}
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth="10" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="var(--foreground)"
        fontSize={size / 4.8}
        fontWeight="800"
      >
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}

export function Sparkline({
  values,
  width = 160,
  height = 40,
  label,
}: {
  values: number[]; // 0..1 (or any scale — normalized internally)
  width?: number;
  height?: number;
  label?: string;
}) {
  if (values.length === 0) return null;
  const max = Math.max(...values, 0.0001);
  const pts = values.map((v, i) => {
    const x = values.length === 1 ? width / 2 : (i / (values.length - 1)) * (width - 8) + 4;
    const y = height - 4 - (v / max) * (height - 8);
    return `${x},${y}`;
  });
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label ?? "trend"}>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.length > 0 && (
        <circle
          cx={Number(pts[pts.length - 1].split(",")[0])}
          cy={Number(pts[pts.length - 1].split(",")[1])}
          r="3.5"
          fill="var(--accent)"
        />
      )}
    </svg>
  );
}

export function BarRow({
  values,
  width = 160,
  height = 44,
  label,
}: {
  values: number[];
  width?: number;
  height?: number;
  label?: string;
}) {
  if (values.length === 0) return null;
  const max = Math.max(...values, 1);
  const bw = (width - (values.length - 1) * 4) / values.length;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label ?? "activity"}>
      {values.map((v, i) => {
        const h = Math.max(3, (v / max) * (height - 6));
        return (
          <rect
            key={i}
            x={i * (bw + 4)}
            y={height - h}
            width={bw}
            height={h}
            rx="2"
            fill={i === values.length - 1 ? "var(--primary)" : "var(--secondary)"}
          />
        );
      })}
    </svg>
  );
}
