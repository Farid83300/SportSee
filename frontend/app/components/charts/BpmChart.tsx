// =============================================================================
// SPORTSEE — Graphique BPM (barres + ligne moyenne — semaine courante)
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

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
        <Bar
          dataKey="min"
          fill="var(--color-bar-bpm-min)"
          radius={[4, 4, 0, 0]}
          maxBarSize={14}
        />
        <Bar
          dataKey="max"
          fill="var(--color-bar-bpm-max)"
          radius={[4, 4, 0, 0]}
          maxBarSize={14}
        />
        <Line
          type="monotone"
          dataKey="average"
          stroke="var(--color-primary)"
          strokeWidth={2}
          dot={{ fill: "var(--color-primary)", r: 4 }}
          connectNulls
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
