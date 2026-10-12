// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AboutUs from './pages/Links/AboutUs';
import CmDepartment from './pages/Links/CmDepartment';
import ImportantLinks from './pages/Links/ImportantLinks';
import Circulars from './pages/Circulars';
import DopPage from './pages/DopPage';
// import DSR from './pages/DSR';
import Manuals from './pages/Manuals';
import ProtectedRoute from './components/ProtectedRoute';
import UploadPage from './pages/UploadPage';
import ExternalLinks from './pages/Links/ExternalLinks';
import CoalMiningLinks from './pages/CoalMiningLinks';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f5f7fb] flex flex-col">

        {/* ---------- BODY: Sidebar + Main Content ---------- */}
        <div className="flex flex-1 min-h-0">

          {/* LEFT: Sidebar (always visible) */}
          <Sidebar />

          {/* RIGHT: Topbar + Page Content */}
          <div className="flex-1 min-w-0 flex flex-col">

            {/* TOP: Topbar (always visible on every page) */}
            <div className="px-4 pt-4 pb-2">
              <Topbar />
            </div>

            {/* PAGE CONTENT */}
            <main className="flex-1 min-w-0">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/cmdepartment" element={<CmDepartment />} />
                <Route path="/important-links" element={<ImportantLinks />} />
                <Route path="/external-links" element={<ExternalLinks />} />
                <Route path="/circulars" element={<Circulars />} />
                <Route path="/doppage" element={<DopPage />} />
                {/* <Route path="/dsr" element={<DSR />} /> */}
                <Route path="/manuals" element={<Manuals />} />
                <Route path="/coal-mining-links" element={<CoalMiningLinks />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/upload" element={<UploadPage />} />
                </Route>
              </Routes>
            </main>
          </div>
        </div>

        {/* ---------- FOOTER (always visible on every page) ---------- */}
        <footer className="bg-[#04173e] text-white text-center py-3 text-sm md:text-base font-semibold tracking-wide">
          © {new Date().getFullYear()} NTPC C&amp;M SIKRI. All rights reserved.
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;