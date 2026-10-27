// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WorkFlowDetail from './pages/WorkFlowDetail';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Event from './pages/Links/Events';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AboutUs from './pages/Links/AboutUs';
import CmDepartment from './pages/Links/CmDepartment';
import ImportantLinks from './pages/Links/ImportantLinks';
import Circulars from './pages/Circulars';
import DopPage from './pages/DopPage';
import Manuals from './pages/Manuals';
import ProtectedRoute from './components/ProtectedRoute';
import UploadPage from './pages/UploadPage';
import ExternalLinks from './pages/Links/ExternalLinks';
import CoalMiningLinks from './pages/Links/CoalMiningLinks';
import ChartDetail from './pages/ChartDetail';   // ← NEW
import LiveWorkStatus from './pages/LiveWorkStatus';
import UploadWorkStatus from './pages/Upload/UploadWorkStatus';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-linear-to-r from-[#9D94F2] via-[#9198ED] to-[#85C2D6] flex flex-col">

        <div className="flex flex-1 min-h-0">
          <Sidebar />

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="px-4 pt-4 pb-2">
              <Topbar />
            </div>

            <main className="flex-1 min-w-0">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/chart/:chartId" element={<ChartDetail />} />   {/* ← NEW */}
                <Route path="/login" element={<Login />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/cmdepartment" element={<CmDepartment />} />
                <Route path="/important-links" element={<ImportantLinks />} />
                <Route path="/external-links" element={<ExternalLinks />} />
                <Route path="/circulars" element={<Circulars />} />
                <Route path="/doppage" element={<DopPage />} />
                <Route path="/live-work-status" element={<LiveWorkStatus />} />
                <Route path="/manuals" element={<Manuals />} />
                <Route path="/coal-mining-links" element={<CoalMiningLinks />} />
                <Route path="/events" element={<Event />} />
                 <Route path="/work-flow/:step" element={<WorkFlowDetail />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/upload" element={<UploadPage />} />
                  
                
                <Route path="/upload-work-status" element={<UploadWorkStatus />} /> {/* NEW */}

                </Route>
              </Routes>
            </main>
          </div>
        </div>

        <footer className="bg-[#04173e] text-white text-center py-3 text-sm font-semibold tracking-wide">
          © {new Date().getFullYear()} NTPC C&amp;M SIKRI. All rights reserved.
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;