import React from 'react';
import { Link } from 'react-router-dom';

const LATEST_ITEMS = [
  {
    label: 'Vishwakarma Puja 2026',
    color: 'from-amber-500 to-orange-500',
    href: '/events',
  },
  {
    label: 'Puja Details',
    color: 'from-emerald-500 to-teal-500',
    href: '/events',
  },
  {
    label: 'Celebration Highlights',
    color: 'from-pink-500 to-rose-500',
    href: '/events',
  },
];

function Latest() {
  return (
    <div className="w-full overflow-hidden border-y border-blue-800 bg-gradient-to-r from-[#0b3d91] via-[#1e5fd0] to-[#0b3d91] py-3 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex shrink-0 items-center gap-2 border-r border-white/20 px-4">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>

          <span className="text-[11px] font-extrabold uppercase tracking-widest text-white">
            Latest
          </span>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="marquee-track">
            {[...LATEST_ITEMS, ...LATEST_ITEMS].map((item, index) => (
              <Link
                key={`${item.label}-${index}`}
                to={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r ${item.color} px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:scale-105 hover:shadow-md`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .marquee-track {
          display: flex;
          width: max-content;
          gap: 1.5rem;
          animation: marqueeScroll 25s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
}

export default Latest;