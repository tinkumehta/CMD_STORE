// src/components/WorkFlowStatus.jsx
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Megaphone, PackageOpen, Stamp, MousePointerClick } from 'lucide-react';

const parseDate = (dateStr) => {
  if (!dateStr || dateStr === 'NA' || dateStr === '-') return null;
  if (dateStr instanceof Date) return dateStr;
  const str = String(dateStr).trim();
  if (str.includes('-')) {
    const parts = str.split('-');
    if (parts[0].length === 4) return new Date(parts[0], parts[1] - 1, parts[2]); 
    return new Date(parts[2], parts[1] - 1, parts[0]); 
  }
  return new Date(str);
};

const getDaysDiff = (date1, date2) => {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  if (!d1 || !d2 || isNaN(d1) || isNaN(d2)) return null;
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const WorkFlowStatus = ({ workCases }) => {
  const navigate = useNavigate();

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

    const calcAvg = (arr) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

    return {
      prToNit: calcAvg(prToNit),
      nitToBod: calcAvg(nitToBod),
      bodToAward: calcAvg(bodToAward),
    };
  }, [workCases]);

  const steps = [
    { id: 'PR', label: 'PR', sub: 'Requisition', icon: <FileText size={18} />, color: 'bg-[#13293D]', avg: averages.prToNit, route: 'pr-nit' },
    { id: 'NIT', label: 'NIT', sub: 'Tender', icon: <Megaphone size={18} />, color: 'bg-[#0D9488]', avg: averages.nitToBod, route: 'nit-bod' },
    { id: 'BOD', label: 'BOD', sub: 'Bid Opening', icon: <PackageOpen size={18} />, color: 'bg-[#EA580C]', avg: averages.bodToAward, route: 'bod-award' },
    { id: 'AWD', label: 'Award', sub: 'Contract', icon: <Stamp size={18} />, color: 'bg-[#13293D]', avg: averages.bodToAward, route: 'bod-award' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col group/flow">
      <div className="bg-[#13293D] py-3 px-4 text-center flex items-center justify-center gap-2">
        <h2 className="text-white text-xs md:text-sm font-semibold tracking-wide">
          Average Days to Complete
        </h2>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-center">
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-5 left-6 right-6 h-0.5 bg-gray-200 z-0"></div>

          <div className="flex justify-between relative z-10">
            {steps.map((step) => (
              <div 
                key={step.id} 
                onClick={() => navigate(`/work-flow/${step.route}`)}
                className="flex flex-col items-center flex-1 cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-full ${step.color} text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                  {step.icon}
                </div>
                <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{step.label}</span>
                <span className="text-[10px] text-gray-500 mb-2">{step.sub}</span>
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-2 py-1 text-center w-full min-w-[50px] group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                  <span className="text-sm font-extrabold text-blue-700 group-hover:text-white transition-colors">{step.avg}</span>
                  <span className="text-[9px] text-blue-500 ml-1 group-hover:text-blue-200 transition-colors">d</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-2 text-center border-t border-gray-100 flex items-center justify-center gap-1 group-hover/flow:bg-blue-50 transition-colors">
        <MousePointerClick size={12} className="text-gray-400" />
        <span className="text-[10px] text-gray-500 font-medium">Click any step to view detailed PO list</span>
      </div>
    </div>
  );
};

export default WorkFlowStatus;