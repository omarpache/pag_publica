"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {
  datos: Record<string, number | null>[];
  paises: { iso3: string; nombre: string }[];
};

const COLORES = [
  "#2B4C5C", "#A13D2B", "#3A5A45", "#8A6D1F",
  "#5B3A6E", "#1F6E6E", "#8E3B5E", "#4A6B1F",
];

// 6 formas distintas — se rotan según el índice del país
function ShapeDot(props: {
  cx?: number;
  cy?: number;
  color: string;
  shapeIndex: number;
}) {
  const { cx, cy, color, shapeIndex } = props;
  if (cx === undefined || cy === undefined) return null;
  const s = 5; // tamaño base

  switch (shapeIndex % 6) {
    case 0: // círculo
      return <circle cx={cx} cy={cy} r={s} fill={color} />;
    case 1: // cuadrado
      return <rect x={cx - s} y={cy - s} width={s * 2} height={s * 2} fill={color} />;
    case 2: // triángulo
      return (
        <polygon
          points={`${cx},${cy - s * 1.2} ${cx - s * 1.1},${cy + s} ${cx + s * 1.1},${cy + s}`}
          fill={color}
        />
      );
    case 3: // diamante
      return (
        <polygon
          points={`${cx},${cy - s * 1.3} ${cx + s * 1.3},${cy} ${cx},${cy + s * 1.3} ${cx - s * 1.3},${cy}`}
          fill={color}
        />
      );
    case 4: // cruz
      return (
        <g stroke={color} strokeWidth={2.5}>
          <line x1={cx - s} y1={cy - s} x2={cx + s} y2={cy + s} />
          <line x1={cx - s} y1={cy + s} x2={cx + s} y2={cy - s} />
        </g>
      );
    case 5: // estrella (simplificada, 4 picos)
      return (
        <g fill={color}>
          <polygon
            points={`${cx},${cy - s * 1.4} ${cx + s * 0.4},${cy - s * 0.4} ${cx + s * 1.4},${cy} ${cx + s * 0.4},${cy + s * 0.4} ${cx},${cy + s * 1.4} ${cx - s * 0.4},${cy + s * 0.4} ${cx - s * 1.4},${cy} ${cx - s * 0.4},${cy - s * 0.4}`}
          />
        </g>
      );
    default:
      return <circle cx={cx} cy={cy} r={s} fill={color} />;
  }
}

export default function GraficaPisa({ datos, paises }: Props) {
  return (
    <div style={{ width: "100%", height: 380 }}>
      <ResponsiveContainer>
        <LineChart data={datos} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E0" />
          <XAxis dataKey="anio" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Legend />
          {paises.map((pais, i) => {
            const color = COLORES[i % COLORES.length];
            return (
              <Line
                key={pais.iso3}
                type="monotone"
                dataKey={pais.iso3}
                name={pais.nombre}
                stroke={color}
                strokeWidth={2}
                connectNulls
                dot={(dotProps: { cx?: number; cy?: number }) => (
                  <ShapeDot
                    key={`${pais.iso3}-${dotProps.cx}-${dotProps.cy}`}
                    cx={dotProps.cx}
                    cy={dotProps.cy}
                    color={color}
                    shapeIndex={i}
                  />
                )}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
