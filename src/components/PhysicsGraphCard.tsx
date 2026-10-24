import React, { useState } from 'react';
import { PhysicsGraphData } from '../physics/tools';
import { TrendingUp, Maximize2 } from 'lucide-react';

interface PhysicsGraphCardProps {
  graphData: PhysicsGraphData;
  className?: string;
}

export const PhysicsGraphCard: React.FC<PhysicsGraphCardProps> = ({ graphData, className = '' }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number } | null>(null);

  const { points, xLabel, yLabel, xUnit, yUnit, title, summary, interpretation } = graphData;

  if (!points || points.length === 0) return null;

  // Compute graph bounds
  const xValues = points.map((p) => p.x);
  const yValues = points.map((p) => p.y);

  const minX = Math.min(0, ...xValues);
  const maxX = Math.max(...xValues) * 1.05 || 10;
  const minY = Math.min(0, ...yValues);
  const maxY = Math.max(...yValues) * 1.15 || 10;

  const width = 560;
  const height = 300;
  const padding = { top: 35, right: 30, bottom: 45, left: 60 };

  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const scaleX = (x: number) => padding.left + ((x - minX) / (maxX - minX || 1)) * plotW;
  const scaleY = (y: number) => padding.top + plotH - ((y - minY) / (maxY - minY || 1)) * plotH;

  // Path data
  const pathD = points.reduce((acc, pt, idx) => {
    const xCoord = scaleX(pt.x);
    const yCoord = scaleY(pt.y);
    return idx === 0 ? `M ${xCoord} ${yCoord}` : `${acc} L ${xCoord} ${yCoord}`;
  }, '');

  // Shaded area path (trapezoid down to y = 0 axis)
  const baselineY = scaleY(0);
  const areaD = `${pathD} L ${scaleX(points[points.length - 1].x)} ${baselineY} L ${scaleX(points[0].x)} ${baselineY} Z`;

  // Generate 5 grid ticks
  const xTicks = [0, 0.25, 0.5, 0.75, 1.0].map((f) => minX + f * (maxX - minX));
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0].map((f) => minY + f * (maxY - minY));

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-slate-800 shadow-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-3 border-b border-blue-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100">{title}</h4>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-medium">
          Deterministic Tool Output
        </span>
      </div>

      {/* SVG Canvas */}
      <div className="p-4 bg-slate-950 flex flex-col items-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-xl h-auto select-none"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((yVal, i) => (
            <g key={`y-grid-${i}`}>
              <line
                x1={padding.left}
                y1={scaleY(yVal)}
                x2={width - padding.right}
                y2={scaleY(yVal)}
                stroke="#1e293b"
                strokeDasharray="3 3"
              />
              <text
                x={padding.left - 10}
                y={scaleY(yVal) + 4}
                fill="#94a3b8"
                fontSize="11"
                textAnchor="end"
                fontFamily="monospace"
              >
                {yVal.toFixed(1)}
              </text>
            </g>
          ))}

          {xTicks.map((xVal, i) => (
            <g key={`x-grid-${i}`}>
              <line
                x1={scaleX(xVal)}
                y1={padding.top}
                x2={scaleX(xVal)}
                y2={height - padding.bottom}
                stroke="#1e293b"
                strokeDasharray="3 3"
              />
              <text
                x={scaleX(xVal)}
                y={height - padding.bottom + 18}
                fill="#94a3b8"
                fontSize="11"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {xVal.toFixed(1)}
              </text>
            </g>
          ))}

          {/* Axes */}
          <line
            x1={padding.left}
            y1={scaleY(0)}
            x2={width - padding.right}
            y2={scaleY(0)}
            stroke="#475569"
            strokeWidth="1.5"
          />
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Axis Labels */}
          <text
            x={width / 2}
            y={height - 8}
            fill="#cbd5e1"
            fontSize="12"
            fontWeight="500"
            textAnchor="middle"
          >
            {xLabel} ({xUnit})
          </text>
          <text
            x={-height / 2}
            y={18}
            transform="rotate(-90)"
            fill="#cbd5e1"
            fontSize="12"
            fontWeight="500"
            textAnchor="middle"
          >
            {yLabel} ({yUnit})
          </text>

          {/* Shaded Area under curve */}
          <path d={areaD} fill="url(#curveGradient)" />

          {/* Plot Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Key Data Points */}
          {points.map((pt, idx) => {
            const isEndpoint = idx === 0 || idx === points.length - 1;
            const cx = scaleX(pt.x);
            const cy = scaleY(pt.y);

            return (
              <g
                key={`pt-${idx}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt)}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isEndpoint ? 5 : 3.5}
                  fill={isEndpoint ? '#f59e0b' : '#38bdf8'}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* Hover Crosshair tooltip */}
          {hoveredPoint && (
            <g>
              <line
                x1={scaleX(hoveredPoint.x)}
                y1={padding.top}
                x2={scaleX(hoveredPoint.x)}
                y2={height - padding.bottom}
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <line
                x1={padding.left}
                y1={scaleY(hoveredPoint.y)}
                x2={width - padding.right}
                y2={scaleY(hoveredPoint.y)}
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <rect
                x={Math.min(width - 120, scaleX(hoveredPoint.x) + 8)}
                y={Math.max(15, scaleY(hoveredPoint.y) - 25)}
                width="110"
                height="28"
                rx="4"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="1"
              />
              <text
                x={Math.min(width - 120, scaleX(hoveredPoint.x) + 8) + 55}
                y={Math.max(15, scaleY(hoveredPoint.y) - 25) + 18}
                fill="#f8fafc"
                fontSize="11"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {hoveredPoint.x.toFixed(1)} {xUnit}, {hoveredPoint.y.toFixed(1)} {yUnit}
              </text>
            </g>
          )}
        </svg>

        {/* Legend / Metrics Chips */}
        <div className="w-full mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {summary.slope && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex items-center justify-between text-slate-300">
              <span className="text-slate-400">{summary.slope.label}:</span>
              <span className="font-mono font-semibold text-amber-400">
                {summary.slope.value} {summary.slope.unit}
              </span>
            </div>
          )}
          {summary.areaUnderCurve && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex items-center justify-between text-slate-300">
              <span className="text-slate-400">{summary.areaUnderCurve.label}:</span>
              <span className="font-mono font-semibold text-sky-400">
                {summary.areaUnderCurve.value} {summary.areaUnderCurve.unit}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Physics Interpretation Footer */}
      {interpretation && (
        <div className="px-4 py-3 bg-blue-50/60 dark:bg-slate-800/50 border-t border-blue-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
          <span className="font-semibold text-blue-900 dark:text-blue-300 mr-1">Interpretation:</span>
          {interpretation}
        </div>
      )}
    </div>
  );
};
