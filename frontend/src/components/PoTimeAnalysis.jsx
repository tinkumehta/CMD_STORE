import { useMemo, useState } from 'react';
import BarChart from './BarChart';

const TIME_VIEWS = [
  { key: 'both', label: 'Weeks & Months' },
  { key: 'weeks', label: 'Weeks' },
  { key: 'months', label: 'Months' },
  { key: 'quarterly', label: 'Quarterly' },
  { key: 'yearly', label: 'Yearly' },
];

const ENQ_COLORS = ['#3b82f6', '#f59e0b', '#22c55e', '#ef4444', '#8b5cf6', '#14b8a6'];

const PoTimeAnalysis = ({ pos, compact = false }) => {
  const [timeView, setTimeView] = useState('both');

  const { chartData, tableData } = useMemo(() => {
    if (!pos.length) {
      return { chartData: { labels: [], datasets: [] }, tableData: [] };
    }

    const byEnqType = {};
    pos.forEach((po) => {
      const type = po.enq_type;
      if (!type || type === 'Unknown') return;
      const days = parseFloat(po.pr_po_days) || 0;
      if (!byEnqType[type]) byEnqType[type] = [];
      byEnqType[type].push(days);
    });

    const enqTypes = Object.keys(byEnqType).sort();
    const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

    const buildTableData = (types, weeksArr, monthsArr) =>
      types.map((t, i) => ({
        enqType: t,
        weeks: weeksArr[i].toFixed(1),
        months: monthsArr[i].toFixed(1),
      }));

    const weeksValues = enqTypes.map((t) => avg(byEnqType[t]) / 7);
    const monthsValues = enqTypes.map((t) => avg(byEnqType[t]) / 30);

    const quarterKey = (dateStr) => {
      const d = new Date(dateStr);
      if (isNaN(d)) return null;
      const q = Math.floor(d.getMonth() / 3) + 1;
      return `${d.getFullYear()} Q${q}`;
    };

    const yearKey = (dateStr) => {
      const d = new Date(dateStr);
      return isNaN(d) ? null : d.getFullYear().toString();
    };

    const groupByKey = (keyFn) => {
      const groups = {};
      pos.forEach((po) => {
        const type = po.enq_type;
        if (!type || type === 'Unknown') return;
        const key = keyFn(po.date);
        if (!key) return;
        if (!groups[key]) groups[key] = {};
        if (!groups[key][type]) groups[key][type] = [];
        groups[key][type].push(parseFloat(po.pr_po_days) || 0);
      });
      return groups;
    };

    if (timeView === 'both') {
      return {
        chartData: {
          labels: enqTypes,
          datasets: [
            { label: 'Average (Weeks)', data: weeksValues, backgroundColor: '#3b82f6', borderRadius: 6 },
            { label: 'Average (Months)', data: monthsValues, backgroundColor: '#22c55e', borderRadius: 6 },
          ],
        },
        tableData: buildTableData(enqTypes, weeksValues, monthsValues),
      };
    }

    if (timeView === 'weeks') {
      return {
        chartData: {
          labels: enqTypes,
          datasets: [{ label: 'Average (Weeks)', data: weeksValues, backgroundColor: '#3b82f6', borderRadius: 6 }],
        },
        tableData: buildTableData(enqTypes, weeksValues, monthsValues),
      };
    }

    if (timeView === 'months') {
      return {
        chartData: {
          labels: enqTypes,
          datasets: [{ label: 'Average (Months)', data: monthsValues, backgroundColor: '#22c55e', borderRadius: 6 }],
        },
        tableData: buildTableData(enqTypes, weeksValues, monthsValues),
      };
    }

    const groups = timeView === 'quarterly' ? groupByKey(quarterKey) : groupByKey(yearKey);
    const groupLabels = Object.keys(groups).sort();
    const allTypes = [...new Set(pos.map((p) => p.enq_type).filter((t) => t && t !== 'Unknown'))].sort();

    const datasets = allTypes.map((type, i) => ({
      label: type,
      data: groupLabels.map((g) => {
        const days = groups[g][type] || [];
        if (!days.length) return 0;
        const divisor = timeView === 'quarterly' ? 7 : 30;
        return days.reduce((a, b) => a + b, 0) / days.length / divisor;
      }),
      backgroundColor: ENQ_COLORS[i % ENQ_COLORS.length],
      borderRadius: 6,
    }));

    return {
      chartData: { labels: groupLabels, datasets },
      tableData: buildTableData(enqTypes, weeksValues, monthsValues),
    };
  }, [pos, timeView]);

  const yLabel =
    timeView === 'both' ? 'Average Time' :
    timeView === 'weeks' ? 'Average (Weeks)' :
    timeView === 'months' ? 'Average (Months)' :
    timeView === 'quarterly' ? 'Average (Weeks)' : 'Average (Months)';

  const xLabel = timeView === 'quarterly' || timeView === 'yearly' ? 'Period' : 'Enquiry Type';

  return (
    <div className="w-full space-y-4">
      
      {/* Toggle Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-sm font-bold text-gray-800">PO Completed Average Time</h2>
          <p className="text-[10px] text-gray-500">Toggle time-based views</p>
        </div>
        <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg">
          {TIME_VIEWS.map((view) => (
            <button
              key={view.key}
              onClick={() => setTimeView(view.key)}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all duration-200 ${
                timeView === view.key
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-white hover:text-blue-700'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0f2e9e] to-[#1e85ec] px-4 py-3 text-white text-center">
          <h2 className="text-base font-extrabold tracking-tight">PO Completed Average Time</h2>
          <p className="text-[10px] text-blue-100 mt-0.5">
            {timeView === 'quarterly' ? 'Quarterly' : timeView === 'yearly' ? 'Yearly' : 'Week & Month Base'} · Average time from PR to PO completion
          </p>
        </div>

        <div className="p-4">
          <BarChart
            labels={chartData.labels}
            datasets={chartData.datasets}
            yAxisLabel={yLabel}
            xAxisLabel={xLabel}
          />
        </div>
      </div>

      {/* Info Panels: Only show if NOT compact mode */}
      {!compact && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Data Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-100 bg-blue-50/50">
              <h3 className="text-xs font-bold text-gray-800">Average PO Completion Time</h3>
            </div>
            <div className="p-3">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-100">
                    <th className="text-left py-1.5 font-semibold">Enquiry Type</th>
                    <th className="text-right py-1.5 font-semibold">Weeks</th>
                    <th className="text-right py-1.5 font-semibold">Months</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, idx) => (
                    <tr key={row.enqType} className="border-b border-gray-50 last:border-0">
                      <td className="py-1.5 font-bold text-gray-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: ENQ_COLORS[idx % ENQ_COLORS.length] }} />
                        {row.enqType}
                      </td>
                      <td className="py-1.5 text-right font-semibold text-gray-700">{row.weeks}</td>
                      <td className="py-1.5 text-right font-semibold text-gray-700">{row.months}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-emerald-50/60 rounded-2xl border border-emerald-100 p-4">
            <h3 className="text-xs font-bold text-emerald-800 mb-2">💡 Key Insights</h3>
            <ul className="text-[11px] text-emerald-900 space-y-1.5 leading-relaxed">
              {tableData.length > 0 && (
                <>
                  <li>• <strong>{[...tableData].sort((a, b) => parseFloat(b.weeks) - parseFloat(a.weeks))[0]?.enqType}</strong> takes the longest time.</li>
                  <li>• <strong>{[...tableData].filter(r => parseFloat(r.weeks) > 0).sort((a, b) => parseFloat(a.weeks) - parseFloat(b.weeks))[0]?.enqType}</strong> is the fastest.</li>
                  <li>• Calculated from PR date to PO completion.</li>
                </>
              )}
            </ul>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-xs font-bold text-gray-800 mb-2">Legend</h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block"></span>
                <span className="text-[11px] text-gray-700">Average (Weeks)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-green-500 inline-block"></span>
                <span className="text-[11px] text-gray-700">Average (Months)</span>
              </div>
            </div>
            <hr className="border-gray-100 my-2" />
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Values rounded to 1 decimal place.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoTimeAnalysis;