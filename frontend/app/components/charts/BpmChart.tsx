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

  // ---------------------------------------------------------------------------
  // Calcul du domaine Y stable — basé sur toutes les valeurs non nulles
  // Arrondi à la dizaine pour éviter les sauts d'axe entre semaines
  // ---------------------------------------------------------------------------
  const allValues = chartData.flatMap((d) =>
    [d.min, d.max].filter((v): v is number => v !== null)
  );

  const yMin = allValues.length > 0
    ? Math.floor(Math.min(...allValues) / 10) * 10
    : 100; // fallback si semaine vide

  const yMax = allValues.length > 0
    ? Math.ceil(Math.max(...allValues) / 10) * 10
    : 200; // fallback si semaine vide

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
          domain={[yMin, yMax]}
        />
        <Tooltip
          cursor={false}
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

        {/* Barres Min — rose clair */}
        <Bar
          dataKey="min"
          maxBarSize={14}
          fill="var(--color-bar-bpm-min)"
          shape={(props: any) => {
            const { x, y, width, height, fill } = props;
            return <rect x={x} y={y} width={width} height={height} rx={7} ry={7} fill={fill} />;
          }}
          activeBar={(props: any) => {
            const { x, y, width, height } = props;
            return <rect x={x} y={y} width={width} height={height} rx={7} ry={7} fill="var(--color-bar-bpm-min)" />;
          }}
        />

        {/* Barres Max — rouge */}
        <Bar
          dataKey="max"
          maxBarSize={14}
          fill="var(--color-bar-bpm-max)"
          shape={(props: any) => {
            const { x, y, width, height, fill } = props;
            return <rect x={x} y={y} width={width} height={height} rx={7} ry={7} fill={fill} />;
          }}
          activeBar={(props: any) => {
            const { x, y, width, height } = props;
            return <rect x={x} y={y} width={width} height={height} rx={7} ry={7} fill="var(--color-bar-bpm-max)" />;
          }}
        />

        {/* Ligne courbée — grise par défaut, bleue au survol */}
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
