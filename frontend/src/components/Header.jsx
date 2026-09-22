import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleHomeClick = (e, item) => {
    if (item.name === 'Home') {
      e.preventDefault();
      window.location.href = '/';
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Directory', path: '/directory', hasDropdown: true },
    { name: 'Important Links', path: '/important-links', hasDropdown: true },
    { name: 'Circulars & Guidelines', path: '/circulars', hasDropdown: true },
    { name: 'DOP', path: '/dop', hasDropdown: true },
    { name: 'DSR', path: '/dsr' },
    { name: 'Manuals & Standards', path: '/manuals', hasDropdown: true },
  ];

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm">
      {/* Top Tier: Logos & Auth */}
      <div className="w-full bg-white px-6 py-3 flex justify-between items-center border-b border-gray-100">
        <Link to="/"><img src="/ntpc-logo.png" alt="NTPC" className='w-22 object-contain' /></Link>
        <h1 className="text-center leading-tight">
          <span className="block text-[#0b70e2] font-semibold text-[26px] font-serif">SHARED SERVICE SITE C&M</span>
          <span className="block text-[#39aef3] font-semibold text-[26px] font-serif">CBCMP & KDCMP</span>
        </h1>
        <div className="flex flex-col items-center gap-1.5">
          <img src="/nml_logo.png" alt="NML" className='w-24 object-contain' />
          <div className="flex gap-1.5">
            {user ? (
              <>
                <Link to="/upload" className="bg-gradient-to-b from-blue-400 to-blue-700 text-white px-3 py-[5px] rounded-full font-bold text-[11px]">Admin Upload</Link>
                <button onClick={logout} className="bg-gradient-to-b from-blue-400 to-blue-700 text-white px-3 py-[5px] rounded-full font-bold text-[11px]">Logout</button>
              </>
            ) : (
              <Link to="/login" className="bg-gradient-to-b from-blue-400 to-blue-700 text-white px-3 py-[5px] rounded-full font-bold text-[11px]">LOGIN</Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Tier: Navigation Bar */}
      <nav className="w-full bg-gradient-to-r from-[#0f2e9e] to-[#1e85ec] text-white text-[13px] font-medium relative z-40">
        <div className="px-6 py-2 flex flex-wrap items-center gap-1">
          {navItems.map((item) => (
            <div 
              key={item.name} 
              className="relative"
              onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={item.path}
                onClick={(e) => handleHomeClick(e, item)}
                className={`px-4 py-2 rounded-full hover:bg-white/20 whitespace-nowrap flex items-center gap-1 transition-all duration-200 ${
                  location.pathname === item.path || activeDropdown === item.name ? 'bg-white/25 font-bold' : ''
                }`}
              >
                {item.name}
                {item.hasDropdown && (
                  <svg className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                )}
              </Link>

              {/* Dropdown Menu */}
              {item.hasDropdown && activeDropdown === item.name && (
                <div className="absolute top-full left-0 pt-2 w-64 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    
                    {/* --- Directory Dropdown Items --- */}
                    {item.name === 'Directory' && (
                      <Link 
                        to="/directory/c-and-m" 
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <span className="font-semibold">C & M Department</span>
                      </Link>
                    )}

                    {/* --- Important Links Dropdown Items --- */}
                    {item.name === 'Important Links' && (
                      <>
                        <a 
                          href="https://www.ntpc.co.in/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-50"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                          </div>
                          <span className="font-semibold">NTPC Home Page</span>
                        </a>
                        <a 
                          href="https://www.nml.co.in/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                          </div>
                          <span className="font-semibold">NML Home Page</span>
                        </a>
                      </>
                    )}

                    {/* --- Circulars & Guidelines Dropdown Items --- */}
                    {item.name === 'Circulars & Guidelines' && (
                      <>
                        <a 
                          href="http://10.0.8.168/cs/csind.php" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors border-b border-gray-50"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold leading-tight">SCC C&M Circular</span>
                            <span className="text-[10px] text-gray-400 leading-tight">Internal Portal</span>
                          </div>
                        </a>
                        <a 
                          href="https://sangam.ntpc.co.in/V2/Portal/Department/58" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold leading-tight">USSC Circular</span>
                            <span className="text-[10px] text-gray-400 leading-tight">Sangam Portal</span>
                          </div>
                        </a>
                      </>
                    )}

                    {/* --- DOP Dropdown Items --- */}
                    {item.name === 'DOP' && (
                      <>
                        <a 
                          href="/NTPC-DOP.pdf" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-50"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                          </div>
                          <span className="font-semibold">NTPC DOP</span>
                        </a>
                        <a 
                          href="/NML-DOP.pdf" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                          </div>
                          <span className="font-semibold">NML DOP</span>
                        </a>
                      </>
                    )}

                    {/* --- Manuals & Standards Dropdown Items --- */}
                    {item.name === 'Manuals & Standards' && (
                      <>
                        <a 
                          href="/Purchase_Manual_2018.pdf" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors border-b border-gray-50"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold leading-tight">Purchase Manual 2018</span>
                            <span className="text-[10px] text-gray-400 leading-tight">PDF Document</span>
                          </div>
                        </a>
                        <a 
                          href="/Stores_Manual_2018.pdf" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold leading-tight">Stores Manual 2018</span>
                            <span className="text-[10px] text-gray-400 leading-tight">PDF Document</span>
                          </div>
                        </a>
                      </>
                    )}

                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;