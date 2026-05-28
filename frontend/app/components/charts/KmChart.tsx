// =============================================================================
// SPORTSEE — Graphique Km (barres bleues — 4 dernières semaines)
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface KmChartProps {
  data: { week: string; distance: number }[];
}

export default function KmChart({ data }: KmChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        style={{ cursor: "pointer" }}
      >
        <CartesianGrid vertical={false} stroke="#F0F0F5" />
        <XAxis
          dataKey="week"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "var(--color-text-muted)" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "var(--color-text-muted)" }}
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          formatter={(value) => [`${value} km`, "Distance"]}
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />
        <Bar
          dataKey="distance"
          fill="#B6BDFC"
          radius={[4, 4, 0, 0]}
          maxBarSize={14}
          activeBar={<rect fill="#0B23F4" rx={4} ry={4} />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
