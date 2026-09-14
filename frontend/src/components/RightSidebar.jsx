import React from 'react';
import hop from '../../public/hop.jpg';


const RightSidebar = () => {
  return (
    <div className="w-full lg:w-72 flex flex-col gap-6 shrink-0">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        
        {/* Rectangular Photo */}
        <div className="w-full h-48 mb-4 overflow-hidden rounded-lg bg-gray-200">
          {/* Replace src with your actual HOP photo URL */}
          <img 
            src={hop} 
            alt="Dhananjay Shrikhande" 
            className="w-full h-full object-cover object-top"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=HOP+Photo'; }}
          />
        </div>
        
        {/* Name */}
        <h2 className="text-lg font-bold text-blue-700 mb-1 uppercase tracking-wide">
          DHANANJAY SHRIKHANDE
        </h2>
        
        {/* Title */}
        <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">
          HOP CBCMP
        </p>
      </div>
    </div>
  );
};

export default RightSidebar;