import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Custom plugin: draws "Total POs" + total number in the center
const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;

    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const data = chart.data.datasets[0].data;
    const total = data.reduce((a, b) => a + (Number(b) || 0), 0);

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = '600 11px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Total POs', centerX, centerY - 12);

    ctx.font = 'bold 26px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText(total.toString(), centerX, centerY + 14);

    ctx.restore();
  },
};

const DonutChart = ({ title, subtitle, labels = [], data = [], colors, onClick }) => {
  const hasData = labels.length > 0 && data.length > 0 && data.some((v) => Number(v) > 0);
  const total = data.reduce((a, b) => a + (Number(b) || 0), 0);

  const palette = colors || ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#8B5CF6'];

  const chartData = {
    labels,
    datasets: [{
      data,
      backgroundColor: palette,
      borderWidth: 3,
      borderColor: '#ffffff',
      hoverOffset: 8,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      datalabels: { display: false },
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.96)',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => {
            const value = Number(ctx.parsed) || 0;
            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `  ${ctx.label}: ${value} (${pct}%)`;
          },
        },
      },
    },
    onClick: (e, elements) => {
      if (elements.length > 0 && onClick) onClick(labels[elements[0].index]);
    },
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-800 truncate">{title}</h3>
          <p className="text-[10px] text-gray-400 truncate">{subtitle}</p>
        </div>
      </div>

      {/* Chart + Legend */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center min-h-[200px]">
        <div className="relative h-44">
          {hasData ? (
            <Doughnut
              key={`${labels.join('-')}-${data.join('-')}`}
              data={chartData}
              options={options}
              plugins={[centerTextPlugin]}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-gray-400">No data</div>
          )}
        </div>

        <div className="space-y-3">
          {labels.map((label, idx) => {
            const pct = total > 0 ? ((data[idx] / total) * 100).toFixed(1) : '0.0';
            return (
              <div key={label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: palette[idx % palette.length] }} />
                  <span className="font-semibold text-gray-700 truncate">{label}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-gray-800">{data[idx]}</span>
                  <span className="text-gray-400 text-[10px] w-10 text-right">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;