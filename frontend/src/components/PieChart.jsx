import { useMemo } from 'react';

// ---------- GREEN & ORANGE 3D PALETTE ----------
const SEGMENT_COLORS = [
  {
    base: '#10B981',
    light: '#34D399',
    dark: '#047857',
    edge: '#065F46',
  },
  {
    base: '#F97316',
    light: '#FB923C',
    dark: '#EA580C',
    edge: '#C2410C',
  },
  {
    base: '#0EA5E9',
    light: '#38BDF8',
    dark: '#0284C7',
    edge: '#075985',
  },
  {
    base: '#8B5CF6',
    light: '#A78BFA',
    dark: '#7C3AED',
    edge: '#5B21B6',
  },
];

// Convert polar coords
function polarToCartesian(cx, cy, r, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// Build a donut segment path
function donutPath(cx, cy, innerR, outerR, startAngle, endAngle) {
  const startOuter = polarToCartesian(cx, cy, outerR, endAngle);
  const endOuter = polarToCartesian(cx, cy, outerR, startAngle);
  const startInner = polarToCartesian(cx, cy, innerR, startAngle);
  const endInner = polarToCartesian(cx, cy, innerR, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 1 ${endInner.x} ${endInner.y}`,
    'Z',
  ].join(' ');
}

const PieChart = ({ title, labels = [], data = [], onClick }) => {
  const total = data.reduce((a, b) => a + (Number(b) || 0), 0);
  const hasData = labels.length > 0 && data.length > 0 && total > 0;

  // Build segments
  const segments = useMemo(() => {
    let acc = 0;
    return data.map((v, i) => {
      const start = acc;
      const angle = total ? (Number(v) / total) * 360 : 0;
      acc += angle;
      return {
        value: Number(v),
        label: labels[i],
        color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
        startAngle: start,
        endAngle: acc,
        midAngle: start + angle / 2,
      };
    });
  }, [data, labels, total]);

  const CX = 150;
  const CY = 150;
  const OUTER_R = 130;
  const INNER_R = 82;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      {title && (
        <h3 className="text-sm font-bold text-gray-700 mb-2 px-1">{title}</h3>
      )}

      <div className="flex-1 flex items-center justify-center relative">
        {hasData ? (
          <div className="relative w-full max-w-[380px] aspect-square">
            {/* SVG 3D Donut */}
            <svg
              viewBox="0 0 300 300"
              className="w-full h-full"
              style={{ filter: 'drop-shadow(0 12px 24px rgba(15,23,42,0.18))' }}
            >
              <defs>
                {/* Green gradient */}
                <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="45%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>

                {/* Orange gradient */}
                <linearGradient id="grad-orange" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FB923C" />
                  <stop offset="45%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#C2410C" />
                </linearGradient>

                {/* Blue gradient (fallback) */}
                <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="45%" stopColor="#0EA5E9" />
                  <stop offset="100%" stopColor="#075985" />
                </linearGradient>

                {/* Purple gradient (fallback) */}
                <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A78BFA" />
                  <stop offset="45%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#5B21B6" />
                </linearGradient>

                {/* Radial highlight for glossy 3D look */}
                <radialGradient id="gloss" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>

                {/* Metallic pin gradient */}
                <linearGradient id="pin-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F8FAFC" />
                  <stop offset="50%" stopColor="#94A3B8" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>
              </defs>

              {/* Ambient shadow ring */}
              <circle cx={CX} cy={CY} r={OUTER_R + 6} fill="rgba(15,23,42,0.05)" />

              {/* Draw each segment */}
              {segments.map((seg, i) => {
                const gradId =
                  i === 0
                    ? 'url(#grad-green)'
                    : i === 1
                    ? 'url(#grad-orange)'
                    : i === 2
                    ? 'url(#grad-blue)'
                    : 'url(#grad-purple)';

                return (
                  <g key={i} className="cursor-pointer">
                    {/* Outer 3D bevel */}
                    <path
                      d={donutPath(CX, CY, INNER_R, OUTER_R + 3, seg.startAngle, seg.endAngle)}
                      fill={seg.color.edge}
                      opacity="0.7"
                    />
                    {/* Main segment */}
                    <path
                      d={donutPath(CX, CY, INNER_R, OUTER_R, seg.startAngle, seg.endAngle)}
                      fill={gradId}
                      onClick={() => onClick?.(seg.label)}
                      className="transition-all duration-200 hover:brightness-110"
                    />
                    {/* Inner edge highlight */}
                    <path
                      d={donutPath(CX, CY, INNER_R, INNER_R + 2, seg.startAngle, seg.endAngle)}
                      fill="rgba(255,255,255,0.35)"
                    />
                  </g>
                );
              })}

              {/* Gloss overlay */}
              <circle cx={CX} cy={CY} r={OUTER_R} fill="url(#gloss)" pointerEvents="none" />

              {/* Metallic pins at slice boundaries */}
              {segments.length > 1 &&
                segments.map((seg, i) => {
                  const pinAngle = seg.endAngle;
                  const startP = polarToCartesian(CX, CY, INNER_R - 4, pinAngle);
                  const endP = polarToCartesian(CX, CY, OUTER_R + 25, pinAngle);

                  return (
                    <g key={`pin-${i}`}>
                      <line
                        x1={startP.x}
                        y1={startP.y}
                        x2={endP.x}
                        y2={endP.y}
                        stroke="url(#pin-grad)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx={startP.x} cy={startP.y} r="2.5" fill="#E2E8F0" />
                      <circle cx={endP.x} cy={endP.y} r="2.5" fill="#E2E8F0" />
                    </g>
                  );
                })}

              {/* Center 3D Banner */}
              <g pointerEvents="none">
                {/* Banner shadow */}
                <ellipse cx={CX} cy={CY + 42} rx="60" ry="6" fill="rgba(15,23,42,0.18)" />

                {/* Ribbon background */}
                <path
                  d={`M ${CX - 68} ${CY - 22}
                      Q ${CX - 70} ${CY - 30} ${CX - 60} ${CY - 30}
                      L ${CX + 60} ${CY - 30}
                      Q ${CX + 70} ${CY - 30} ${CX + 68} ${CY - 22}
                      L ${CX + 62} ${CY + 34}
                      Q ${CX + 58} ${CY + 42} ${CX + 48} ${CY + 42}
                      L ${CX - 48} ${CY + 42}
                      Q ${CX - 58} ${CY + 42} ${CX - 62} ${CY + 34}
                      Z`}
                  fill="#F1F5F9"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                />

                {/* Inner ribbon highlight */}
                <path
                  d={`M ${CX - 60} ${CY - 22}
                      Q ${CX - 62} ${CY - 26} ${CX - 54} ${CY - 26}
                      L ${CX + 54} ${CY - 26}
                      Q ${CX + 62} ${CY - 26} ${CX + 60} ${CY - 22}
                      L ${CX + 56} ${CY + 30}
                      Q ${CX + 52} ${CY + 36} ${CX + 44} ${CY + 36}
                      L ${CX - 44} ${CY + 36}
                      Q ${CX - 52} ${CY + 36} ${CX - 56} ${CY + 30}
                      Z`}
                  fill="none"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="1"
                />

                {/* Label text — CBCMP / KDCMP */}
                <text
                  x={CX}
                  y={CY - 4}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="800"
                  fill="#1E293B"
                  fontFamily="Inter, system-ui, sans-serif"
                  letterSpacing="0.5"
                >
                  {labels.length === 2 ? 'CBCMP / KDCMP' : 'TOTAL'}
                </text>

                {/* Total number */}
                <text
                  x={CX}
                  y={CY + 20}
                  textAnchor="middle"
                  fontSize="20"
                  fontWeight="900"
                  fill="#0F172A"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {total.toLocaleString()} POs
                </text>
              </g>
            </svg>

            {/* Legend below chart */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-gray-100">
              {segments.map((seg, i) => (
                <button
                  key={i}
                  onClick={() => onClick?.(seg.label)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: seg.color.base }}
                  />
                  <span className="text-[11px] font-bold text-gray-700">
                    {seg.label}
                  </span>
                  <span className="text-[11px] font-extrabold text-gray-900">
                    {seg.value}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-green-700 py-12">
            <svg
              className="w-16 h-16 mb-3 opacity-30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>
            <p className="text-sm font-medium">No data available</p>
            <p className="text-xs mt-1">Try a different filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChart;