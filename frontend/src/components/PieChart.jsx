import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ title, labels, data, colors }) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors || [
          '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1', 
          '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#06B6D4'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: false },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="flex-1 relative">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PieChart;