
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Megaphone,
  Handshake,
  Award,
  ArrowRight,
} from 'lucide-react';

// DATE PARSER — unchanged
const parseDate = (dateStr) => {
  if (!dateStr || dateStr === 'NA' || dateStr === '-') return null;
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr;

  const str = String(dateStr).trim();
  const parts = str.split(/[-/.]/);

  if (parts.length === 3) {
    const p1 = parseInt(parts[0], 10);
    const p2 = parseInt(parts[1], 10);
    const p3 = parseInt(parts[2], 10);

    if (p1 > 1000) {
      return new Date(Date.UTC(p1, p2 - 1, p3));
    }

    return new Date(Date.UTC(p3, p2 - 1, p1));
  }

  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

// DATE DIFFERENCE — unchanged
const getDaysDiff = (date1, date2) => {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);

  if (!d1 || !d2) return null;

  const diffTime = Math.abs(d2.getTime() - d1.getTime());

  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

const WorkFlowStatus = ({ workCases }) => {
  const navigate = useNavigate();

  // AVERAGE CALCULATIONS — unchanged
  const averages = useMemo(() => {
    let prToNit = [];
    let nitToBod = [];
    let bodToAward = [];

    workCases.forEach((row) => {
      const d1 = getDaysDiff(row.pr_date, row.nit_date);
      if (d1 !== null) prToNit.push(d1);

      const d2 = getDaysDiff(row.nit_date, row.technical_bod);
      if (d2 !== null) nitToBod.push(d2);

      const awardDate = row.loi_date || row.po_date;
      const d3 = getDaysDiff(row.technical_bod, awardDate);

      if (d3 !== null && d3 <= 30) bodToAward.push(d3);
    });

    const calcAvg = (arr) =>
      arr.length > 0
        ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
        : 0;

    return {
      prToNit: calcAvg(prToNit),
      nitToBod: calcAvg(nitToBod),
      bodToAward: calcAvg(bodToAward),
    };
  }, [workCases]);

  // MILESTONES
  const steps = [
    {
      id: 'PR',
      label: 'PR',
      sub: 'Requisition',
      icon: FileText,
      color: 'bg-[#31208f]',
      route: 'pr-nit',
    },
    {
      id: 'NIT',
      label: 'NIT',
      sub: 'Tender',
      icon: Megaphone,
      color: 'bg-[#08a86b]',
      route: 'nit-bod',
    },
    {
      id: 'BOD',
      label: 'BOD',
      sub: 'Bid Opening',
      icon: Handshake,
      color: 'bg-[#f1870b]',
      route: 'bod-award',
    },
    {
      id: 'AWD',
      label: 'Award',
      sub: 'Contract',
      icon: Award,
      color: 'bg-[#252080]',
      route: 'bod-award',
    },
  ];

  // DURATION VALUES
  const durations = [
    {
      label: 'PR to NIT',
      value: averages.prToNit,
      color: 'purple',
      route: 'pr-nit',
    },
    {
      label: 'NIT to BOD',
      value: averages.nitToBod,
      color: 'green',
      route: 'nit-bod',
    },
    {
      label: 'BOD to Award',
      value: averages.bodToAward,
      color: 'orange',
      route: 'bod-award',
    },
  ];

  const durationStyles = {
    purple: {
      bg: 'bg-[#eee0ff]',
      border: 'border-[#a855f7]',
      text: 'text-[#5420a5]',
      hover: 'hover:bg-[#dfc5ff]',
    },
    green: {
      bg: 'bg-[#d5f8e8]',
      border: 'border-[#36c98b]',
      text: 'text-[#087a50]',
      hover: 'hover:bg-[#baf0d6]',
    },
    orange: {
      bg: 'bg-[#ffead9]',
      border: 'border-[#f4a16c]',
      text: 'text-[#a84a12]',
      hover: 'hover:bg-[#ffdbc1]',
    },
  };

  return (
    <div className=" bg-[#c8baed] rounded-2xl shadow-sm border border-gray-700 overflow-hidden h-full  flex flex-col group/flow">

      {/* HEADER */}
      <div className="bg-[#6b36ce] py-3 px-4 text-center items-center justify-center gap-2">
        <h2 className="text-white text-center text-lg font-bold tracking-wide">
          Lead Time to Live PO's
        </h2>
      </div>

      {/* WORKFLOW */}
      <div className="flex-1 flex items-center justify-center px-3 py-3">

        <div className="w-full overflow-x-auto">

          <div className="min-w-[180px]  mx-auto">

            {/* MILESTONES AND HORIZONTAL ARROWS */}
            <div className="grid grid-cols-7 items-center">

              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.id}
                    className="contents"
                  >

                    {/* MILESTONE */}
                    <div
                      style={{ gridColumn: index * 2 + 1 }}
                      onClick={() =>
                        navigate(`/work-flow/${step.route}`)
                      }
                      className="flex flex-col items-center cursor-pointer group/node"
                    >

                      <div
                        className={`w-11 h-11 md:w-12 md:h-12 rounded-full ${step.color} text-white flex items-center justify-center shadow-md ring-2 ring-white/70 group-hover/node:scale-110 transition-all duration-300`}
                      >
                        <Icon size={24} strokeWidth={2.2} />
                      </div>

                      <h3 className="text-sm md:text-base font-extrabold text-[#252080] mt-1.5 group-hover/node:text-purple-700">
                        {step.label}
                      </h3>

                      <span className="text-[9px] text-black font-medium">
                        {step.sub}
                      </span>

                    </div>

                    {/* HORIZONTAL ARROW */}
                    {index !== 3 && (
                      <div
                        style={{ gridColumn: index * 2 + 2 }}
                        className="flex items-center justify-center -mt-5"
                      >
                        <ArrowRight
                          size={21}
                          strokeWidth={2.5}
                          className="text-[#be270c]"
                        />
                      </div>
                    )}

                  </div>
                );
              })}

            </div>

            {/* DIAGONAL ARROWS */}
            <div className="relative h-[75px] mt-1">

              <svg
                viewBox="0 0 700 75"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none"
              >

                <defs>
                  <marker
                    id="workflow-arrow"
                    markerWidth="7"
                    markerHeight="7"
                    refX="5"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0,0 L6,3 L0,6" fill="none" stroke="#6425bd" strokeWidth="1.5" />
                  </marker>
                </defs>

                {/* PR + NIT */}
                <path d="M50 2 L150 65" stroke="#6425bd" strokeWidth="2.5" fill="none" markerEnd="url(#workflow-arrow)" />
                <path d="M250 2 L150 65" stroke="#6425bd" strokeWidth="2.5" fill="none" markerEnd="url(#workflow-arrow)" />

                {/* NIT + BOD */}
                <path d="M250 2 L350 65" stroke="#6425bd" strokeWidth="2.5" fill="none" markerEnd="url(#workflow-arrow)" />
                <path d="M450 2 L350 65" stroke="#6425bd" strokeWidth="2.5" fill="none" markerEnd="url(#workflow-arrow)" />

                {/* BOD + AWARD */}
                <path d="M450 2 L600 65" stroke="#6425bd" strokeWidth="2.5" fill="none" markerEnd="url(#workflow-arrow)" />
                <path d="M650 2 L550 65" stroke="#6425bd" strokeWidth="2.5" fill="none" markerEnd="url(#workflow-arrow)" />

              </svg>

              {/* DURATION PILLS */}
              <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3">

                {durations.map((duration) => {
                  const style = durationStyles[duration.color];

                  return (
                    <div
                      key={duration.label}
                      onClick={() =>
                        navigate(`/work-flow/${duration.route}`)
                      }
                      className="flex justify-center cursor-pointer"
                    >

                      <div
                        className={`relative z-10 min-w-[90px] md:min-w-[105px] px-3 py-2 rounded-full border-2 ${style.bg} ${style.border} ${style.text} ${style.hover} shadow-sm flex items-center justify-center gap-1 hover:scale-105 hover:shadow-md transition-all duration-300`}
                      >

                        <span className="text-xl font-extrabold leading-none">
                          {duration.value}
                        </span>

                        <span className="text-sm font-bold">
                          D
                        </span>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

            {/* DURATION LABELS */}
            <div className="grid grid-cols-3 mt-1 text-center">

              {durations.map((duration) => (
                <span
                  key={duration.label}
                  className="text-[10px] font-semibold text-black"
                >
                  {duration.label}
                </span>
              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default WorkFlowStatus;
