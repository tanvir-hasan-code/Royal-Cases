import { useState } from "react";
import {
  FaBars,
  FaEnvelope,
  FaDownload,
  FaQuestionCircle,
  FaDollarSign,
  FaGavel,
  FaWhatsapp,
  FaFacebook,
  FaCommentDots,
  FaCog,
} from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const NavBtn = ({ icon, text, badge }) => (
    <div className="relative flex items-center gap-2 px-3 py-1.5 
      border border-white/20 rounded-md cursor-pointer 
      hover:bg-white/10 transition-all duration-200">
      
      <span className="text-yellow-400">{icon}</span>
      <span className="text-sm">{text}</span>

      {badge && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-1.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );

  const IconBtn = ({ icon }) => (
    <div className="p-2 border border-white/20 rounded-md cursor-pointer 
      hover:bg-white/10 transition-all duration-200 text-yellow-400">
      {icon}
    </div>
  );

  return (
    <div className="w-full bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white shadow-md">
      <div className="flex items-center justify-between px-5 h-14">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <FaBars 
            className="cursor-pointer text-lg text-yellow-400 lg:hidden" 
            onClick={() => setMenuOpen(!menuOpen)}
          />
          <h1 className="text-xl font-semibold tracking-wide">
            Royal <span className="text-yellow-400 font-light">Case</span>
          </h1>
        </div>

        {/* CENTER - Large Screens */}
        <div className="hidden lg:flex items-center gap-2">
          <NavBtn icon={<FaEnvelope />} text="Inbox" badge="0" />
          <NavBtn icon={<FaDownload />} text="App" />
          <NavBtn icon={<FaQuestionCircle />} text="Help" />
          <NavBtn icon={<FaDollarSign />} text="Pay" />
          <NavBtn icon={<FaGavel />} text="Laws" />
          <span className="ml-2 px-3 py-1.5 border border-yellow-400/40 
            rounded-md text-sm text-yellow-300">
            EXP : 16-02-2026
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <IconBtn icon={<FaWhatsapp />} />
          <IconBtn icon={<FaFacebook />} />
          <IconBtn icon={<FaCommentDots />} />
          <IconBtn icon={<FaCog />} />

          <span className="px-2 py-1 border border-white/20 rounded-md text-sm">
            SMS : 0
          </span>

          <button className="ml-2 bg-yellow-400 hover:bg-yellow-500 
            text-black px-4 py-1.5 rounded-md font-semibold transition">
            Log Out
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden px-5 py-3 flex flex-col gap-2 bg-[#1e293b] border-t border-white/20">
          <NavBtn icon={<FaEnvelope />} text="Inbox" badge="0" />
          <NavBtn icon={<FaDownload />} text="App" />
          <NavBtn icon={<FaQuestionCircle />} text="Help" />
          <NavBtn icon={<FaDollarSign />} text="Pay" />
          <NavBtn icon={<FaGavel />} text="Laws" />
          <span className="px-3 py-1.5 border border-yellow-400/40 
            rounded-md text-sm text-yellow-300">
            EXP : 16-02-2026
          </span>
        </div>
      )}
    </div>
  );
};

export default Navbar;
