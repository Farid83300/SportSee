// =============================================================================
// SPORTSEE — Pie chart objectif hebdomadaire
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface WeeklyPieChartProps {
  done: number;   // séances réalisées
  total: number;  // objectif total
}

export default function WeeklyPieChart({ done, total }: WeeklyPieChartProps) {
  const safeDone  = done  ?? 0;
  const safeTotal = total ?? 0;
  const remaining = Math.max(0, safeTotal - safeDone);

  const COLORS = [
    "var(--color-pie-done)",
    "var(--color-pie-remaining)",
  ];

  // ── Cas : objectif non défini ou zéro → anneau gris vide ─────────────────
  if (safeTotal === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
        <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
          Objectif non défini
        </p>
      </div>
    );
  }

  // ── Cas normal ─────────────────────────────────────────────────────────────
  const data = [
    { name: `${safeDone} réalisées`, value: safeDone },
    { name: `${remaining} restants`,  value: remaining },
  ];

  const dotStyle = (color: string): React.CSSProperties => ({
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: color,
    display: "inline-block",
    flexShrink: 0,
  });

  const labelStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    fontSize: "0.78rem",
    color: "var(--color-text-muted)",
    position: "absolute",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginTop: "1rem",
        // Espace supplémentaire pour que les labels absolus ne soient pas coupés
        paddingBottom: "1.5rem",
        paddingTop: "0.5rem",
        boxSizing: "border-box",
      }}
    >
      {/* ── Donut + légendes positionnées en absolu ── */}
      <div style={{ position: "relative", width: 200, height: 200 }}>

        {/* Donut */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={85}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Légende "réalisées" — bas gauche du donut */}
        <span style={{ ...labelStyle, bottom: -24, left: 5 }}>
          <span style={dotStyle("var(--color-pie-done)")} />
          {safeDone} réalisées
        </span>

        {/* Légende "restants" — haut droite du donut */}
        <span style={{ ...labelStyle, top: 24, right: -80 }}>
          <span style={dotStyle("var(--color-pie-remaining)")} />
          {remaining} restants
        </span>

      </div>
    </div>
  );
}
