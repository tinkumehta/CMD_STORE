// src/components/Topbar.jsx
import { useAuth } from '../context/AuthContext';
import topbar from '../../public/topbar.jpg';

const Topbar = () => {
  const { user } = useAuth();

  return (
    <header className="relative w-full overflow-hidden rounded-2xl shadow-lg">
      {/* Background Banner Image */}
      <img
        src={topbar}
        alt="Shared Service Site C&M"
        className="w-full h-40 md:h-44 object-cover"
      />

      {/* Welcome text overlay (left side) */}
      <div className="absolute inset-0 pointer-events-none m-6 md:m-10 flex flex-col justify-center">
        <marquee direction="right">
        <h1 className="text-lg md:text-xl text-white font-bold tracking-wider drop-shadow-md">
          Welcome
        </h1>
        </marquee>
        <h2 className="text-xl md:text-2xl text-white font-semibold tracking-widest drop-shadow-md">
          Shared Service Site C&amp;M
        </h2>
        <h3 className="text-sm md:text-[15px] text-white font-semibold tracking-widest mt-1 opacity-90 drop-shadow-md">
          CBCMP &amp; KDCMP
        </h3>
      </div>

      {/* NML Logo (top-right) */}
      <div className="absolute top-3 right-4 md:right-6 z-20 flex items-center gap-3">
        <div className="rounded-lg px-4 py-2 flex items-center justify-center">
          <img
            src="/nml_logo.png"
            alt="NML Logo"
            className="h-10 md:h-14 w-auto object-contain drop-shadow-md"
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;