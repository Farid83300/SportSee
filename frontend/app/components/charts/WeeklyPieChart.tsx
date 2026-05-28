// =============================================================================
// SPORTSEE — Pie chart objectif hebdomadaire
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

interface WeeklyPieChartProps {
  done: number;   // séances réalisées
  total: number;  // objectif total
}

export default function WeeklyPieChart({ done, total }: WeeklyPieChartProps) {
  const remaining = Math.max(0, total - done);

  const data = [
    { name: `${done} réalisées`, value: done },
    { name: `${remaining} restants`, value: remaining },
  ];

  const COLORS = [
    "var(--color-pie-done)",
    "var(--color-pie-remaining)",
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Legend
          iconType="circle"
          iconSize={10}
          formatter={(value) => (
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
