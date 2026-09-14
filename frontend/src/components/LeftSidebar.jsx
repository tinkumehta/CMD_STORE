import React from 'react';

const apps = [
  { name: 'ED USSC Dashboard', icon: '📊' },
  { name: 'PRADIP', icon: '🌐' },
  { name: 'Outlook Mail', icon: '✉️' },
  { name: 'E-String', icon: '👥' },
  { name: 'Government e-Marketplace', icon: '🛒' },
  { name: 'GePNIC Portal', icon: '🏛️' },
  { name: 'Integrated Inventory Dashboard', icon: '📦' },
  { name: 'Standard Quality Plan Search', icon: '🔍' },
  { name: 'DIPAC', icon: '👥' },
];

const LeftSidebar = () => {
  return (
    <div className="w-full lg:w-72 flex flex-col gap-6 shrink-0">
      {/* USSC for Stations Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">USSC For Stations</h3>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          {apps.map((app, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition cursor-pointer text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2 group-hover:bg-blue-100 transition">
                <span className="text-xl">{app.icon}</span>
                {/* Replace the span above with: <img src="/your-icon.png" className="w-6 h-6" /> */}
              </div>
              <span className="text-xs font-semibold text-gray-600 leading-tight group-hover:text-blue-700">
                {app.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;