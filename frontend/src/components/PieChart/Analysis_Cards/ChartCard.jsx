// src/components/ChartCard.jsx
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

const MINI_COLORS = ['#10B981', '#F97316', '#3B82F6', '#8B5CF6', '#FBBF24'];

function polarToCartesian(cx, cy, r, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutPath(cx, cy, innerR, outerR, startAngle, endAngle) {
  const startOuter = polarToCartesian(cx, cy, outerR, endAngle);
  const endOuter = polarToCartesian(cx, cy, outerR, startAngle);
  const startInner = polarToCartesian(cx, cy, innerR, startAngle);
  const endInner = polarToCartesian(cx, cy, innerR, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [`M ${startOuter.x} ${startOuter.y}`, `A ${outerR} ${outerR} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}`, `L ${startInner.x} ${startInner.y}`, `A ${innerR} ${innerR} 0 ${largeArc} 1 ${endInner.x} ${endInner.y}`, 'Z'].join(' ');
}

const ChartCard = ({ config, pos }) => {
  const { labels, data } = useMemo(() => (config?.getData ? config.getData(pos) : { labels: [], data: [] }), [config, pos]);
  const total = data.reduce((a, b) => a + b, 0);

  if (config.comingSoon) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 p-5 h-60 flex flex-col items-center justify-center">
        <div className="text-4xl mb-3 opacity-60">{config.icon}</div>
        <h3 className="text-sm font-bold text-black">{config.title}</h3>
        <p className="text-xs text-black mt-1">Coming soon</p>
      </div>
    );
  }

  let acc = 0;
  const segments = labels.map((label, i) => {
    const start = acc;
    const angle = total ? (data[i] / total) * 360 : 0;
    acc += angle;
    return { label, value: data[i], color: MINI_COLORS[i % MINI_COLORS.length], startAngle: start, endAngle: acc };
  });

  return (
    <Link 
      to={`/chart/${config.id}`} 
      >
        <div className="bg-[#97cbf5] rounded-2xl shadow-sm border  border-gray-700 overflow-hidden h-full flex flex-col group/flow">
      <div className="bg-[#3787c8] py-3 px-4 text-center items-center justify-center gap-2">
      
        <h2 className="text-white text-lg text-center  font-bold tracking-wide ">Po Dashboard (CBCMP & KDCMP)</h2>
        
       
      {/* Header Box - Proper Bottom Border */}
      {/* <div className="flex items-center justify-center rounded-xl border  bg-[#597bf6]">
  <div className="min-w-0 text-center">
    <h3 className="font-bold text-white ml-2 text-lg truncate">
      {config.title}
    </h3>

    <p className="text-xs text-white font-bold truncate">
      {config.subtitle}
    </p>
  </div> */}
</div>
      
      {/* Body Box */}
      <div className="flex-1 mt-5 flex items-center gap-4">
        <div className="relative ml-5 w-[150px] h-[150px]  shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="35" fill="none" stroke="#f1f5f9" strokeWidth="18" />
            {segments.map((s, i) => (
              <path key={i} d={donutPath(50, 50, 26, 44, s.startAngle, s.endAngle)} fill={s.color} stroke="#ffffff" strokeWidth="1.5" />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-black font-bold">Total</span>
            <span className="text-base font-extrabold text-gray-800 leading-none">{total}</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0 space-y-1.5">
          {segments.slice(0, 4).map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[15px]">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
              <span className="font-semibold text-black truncate">{s.label}</span>
              <span className="ml-10 font-bold text-black shrink-0">{s.value}</span>
              
            </div>
            
          ))}
          {segments.length > 4 && <div className="text-[10px] text-black/70 italic mt-1">+{segments.length - 4} more…</div>}
         <span className=" font-bold text-black shrink-0">Since Inception (2023)</span>

        </div>
      </div>
   
      {/* Footer Box - mt-auto pushes it perfectly to the bottom */}
      <button 
        className="mt-4 mb-5 cursor-pointer w-90 ml-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
      >
        View Details →
      </button>
      </div>
    </Link>
  );
};

export default ChartCard;