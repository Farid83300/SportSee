// =============================================================================
// SPORTSEE — Graphique BPM (barres + ligne moyenne courbée — semaine courante)
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { UserActivity } from "../../data/mockData";

interface BpmChartProps {
  data: UserActivity;
}

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function BpmChart({ data }: BpmChartProps) {
  // État pour gérer la couleur de la ligne au survol
  const [isHovered, setIsHovered] = useState(false);

  const chartData = DAYS.map((day, index) => {
    const session = data.find((s) => {
      const d = new Date(s.date);
      const dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
      return dayIndex === index;
    });

    return {
      day,
      min: session?.heartRate.min ?? null,
      max: session?.heartRate.max ?? null,
      average: session?.heartRate.average ?? null,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart
        data={chartData}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        style={{ cursor: "pointer" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CartesianGrid vertical={false} stroke="#F0F0F5" />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "var(--color-text-muted)" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "var(--color-text-muted)" }}
          domain={["auto", "auto"]}
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          formatter={(value, name) => {
            const labels: Record<string, string> = {
              min: "Min BPM",
              max: "Max BPM",
              average: "Moy BPM",
            };
            return [`${value} bpm`, labels[name as string] ?? String(name)];
          }}
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />

        {/* Barres Min — rose clair, sans changement au survol */}
        <Bar
          dataKey="min"
          fill="var(--color-bar-bpm-min)"
          radius={[30, 30, 30, 30]}
          maxBarSize={14}
          activeBar={<rect fill="var(--color-bar-bpm-min)" rx={4} ry={4} />}
        />

        {/* Barres Max — rouge, sans changement au survol */}
        <Bar
          dataKey="max"
          fill="var(--color-bar-bpm-max)"
          radius={[30, 30, 30, 30]}
          maxBarSize={14}
          activeBar={<rect fill="var(--color-bar-bpm-max)" rx={4} ry={4} />}
        />

        {/* Ligne courbée — grise par défaut, bleue au survol du graphique
            Points toujours bleus #0B23F4 */}
        <Line
          type="natural"
          dataKey="average"
          stroke={isHovered ? "#0B23F4" : "#F2F3FF"}
          strokeWidth={2}
          dot={{ fill: "#0B23F4", r: 2, stroke: "#0B23F4" }}
          activeDot={{ r: 2, fill: "#0B23F4", stroke: "#0B23F4" }}
          connectNulls
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
