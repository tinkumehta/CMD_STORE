import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ntpclogo from '../../public/ntpc-logo.png'
import nmllogo from "../../public/nml_logo.png"

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement your directory search logic here if needed
    console.log("Searching for:", search);
  };

  return (
    <header className="w-full bg-white shadow-sm">
      {/* Top Tier: Logo, Title, Login/Language */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row justify-between items-center border-b border-gray-200">
       <Link to="/">  <img src={ntpclogo} alt="" className='w-30' /> </Link>
        <div className="flex items-center gap-2">
          {/* <div className="w-16 h-12 bg-blue-900 text-white flex items-center justify-center rounded-sm font-bold text-xs text-center leading-tight">
          
          </div> */}
         
        </div>

        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold text-blue-800 tracking-wide text-center mr-30 ">
          SHARED SERVICE SITE C&M , <br/> CBCMP & KDCMP 
        </h1>

        {/* Right Side: Login & Language */}
        <div className="flex flex-col items-end gap-1">
           <img src={nmllogo} alt="" className='w-30' />
          <div className="flex items-center gap-2 text-sm text-gray-700">
            {user ? (
              <>
                <Link to="/upload" className="text-blue-600 font-semibold hover:underline">Admin Upload</Link>
                <span className="text-gray-300">|</span>
                <button onClick={logout} className="text-red-600 font-semibold hover:underline">Logout</button>
              </>
            ) : (
              <Link to="/login" className="hover:text-blue-600 flex  text-2xl text-red-500">Login</Link>
            )}
            {/* <span className="text-gray-300">|</span> */}
            {/* <span className="hover:text-blue-600 cursor-pointer">हिंदी</span> */}
            {/* <span className="text-gray-300">|</span>
            <span className="text-blue-600 font-semibold">English</span> */}
            
          </div>
          {/* <div className="flex gap-1 mt-1">
            <div className="w-3 h-3 bg-red-500"></div>
            <div className="w-3 h-3 bg-green-600"></div>
            <div className="w-3 h-3 bg-blue-800"></div>
            <div className="w-3 h-3 bg-yellow-400"></div>
          </div> */}
        </div>
      </div>

      {/* Middle Tier: Search Bar */}
      {/* <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex border border-gray-300 rounded overflow-hidden w-full max-w-md">
          <input 
            type="text" 
            placeholder="Directory Search" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 text-sm w-full outline-none"
          />
          <button type="submit" className="bg-gray-200 px-4 py-1.5 text-sm font-medium hover:bg-gray-300 border-l border-gray-300">
            Search
          </button>
        </form>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-gray-300 text-xs font-semibold hover:bg-gray-50">DOWNLOADS</button>
          <button className="px-3 py-1.5 border border-gray-300 text-xs font-semibold hover:bg-gray-50">REPORTS</button>
          <button className="px-3 py-1.5 border border-gray-300 text-xs font-semibold hover:bg-gray-50">ARCHIVE</button>
        </div>
      </div> */}

      {/* Bottom Tier: Blue Navigation Bar */}
      <nav className="bg-blue-800 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap">
          {['Home', 'About Us', 'Directory', 'Departments', 'Corporate Links',  'Circulars & Guidelines', 'DOP', 'DSR', 'GCC', 'Manuals & Standards'].map((item) => (
            <Link key={item} to="#" className="px-3 py-2.5 hover:bg-blue-900 transition-colors whitespace-nowrap text-xl ">
              {item}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;