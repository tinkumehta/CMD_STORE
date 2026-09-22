const KpiCard = ({ icon, title, value, change, changeType = 'up', iconBg, iconColor, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
  >
    <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
      <div className={iconColor}>{icon}</div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 mb-1 truncate">{title}</p>
      <p className="text-xl font-bold text-gray-800 truncate">{value}</p>
      {change && (
        <p className={`text-[10px] font-semibold mt-1 flex items-center gap-1 ${changeType === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
          <span>{changeType === 'up' ? '↑' : '↓'}</span>
          <span>{change}</span>
          <span className="text-gray-400 font-normal ml-0.5">vs last month</span>
        </p>
      )}
    </div>
    <svg className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  </div>
);

export default KpiCard;