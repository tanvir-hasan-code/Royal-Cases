import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaBookOpen,
  FaGavel,
  FaPlusCircle,
  FaBalanceScale,
  FaPlayCircle,
  FaCogs,
  FaBuilding,
  FaLandmark,
  FaFileAlt,
  FaUserTie,
  FaUsers,
  FaCalendarDay,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { icon: <FaHome />, text: "Dashboard", to: "/" },
    { icon: <FaBookOpen />, text: "Daily Notes", to: "/notes" },
    {
      icon: <FaGavel />,
      text: "Cases",
      subMenu: [
        { icon: <FaPlusCircle />, text: "Add New Case", to: "/cases/add" },
        { icon: <FaBalanceScale />, text: "All Cases", to: "/cases/all" },
        { icon: <FaGavel />, text: "Running Cases", to: "/cases/running" },
        { icon: <FaCalendarDay />, text: "Today's Cases", to: "/cases/today" },
        {
          icon: <FaCalendarAlt />,
          text: "Tomorrow's Cases",
          to: "/cases/tomorrow",
        },

        // 🔹 Status based
        {
          icon: <FaExclamationTriangle />,
          text: "Not Updated Cases",
          to: "/cases/pending",
        },
        {
          icon: <FaCheckCircle />,
          text: "Completed Cases",
          to: "/cases/completed",
        },
      ],
    },
    {
      icon: <FaCogs />,
      text: "Master Setup",
      subMenu: [
        { icon: <FaLandmark />, text: "Court Setup", to: "/setup/court" },
        {
          icon: <FaFileAlt />,
          text: "Case Type Setup",
          to: "/setup/case-type",
        },
        {
          icon: <FaUserTie />,
          text: "Police Station Setup",
          to: "/setup/police-station",
        },
        { icon: <FaBuilding />, text: "Company Setup", to: "/setup/company" },
      ],
    },
    {
      icon: <FaUsers />,
      text: "User Management",
      to: "/user-management",
    },
  ];

  return (
    <>
      {/* MOBILE HAMBURGER BUTTON */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-gray-900 text-white">
        <button onClick={() => setOpen(true)}>
          <FaBars size={20} />
        </button>
      </div>

      {/* SIDEBAR */}
      <div
        className={`
    fixed top-0 left-0 h-full bg-gray-900 text-white
    transform ${open ? "translate-x-0" : "-translate-x-full"} 
    transition-transform duration-300 ease-in-out
    lg:translate-x-0 lg:static lg:w-64
    z-50
    flex flex-col
    overflow-hidden
  `}
      >
        {/* USER INFO - Only for desktop */}
        <div className="p-4 border-b border-gray-600 hidden lg:block flex-shrink-0">
          <h2 className="font-semibold">Adv Md Kamal Uddin</h2>
          <p className="text-sm text-green-400">● Online</p>
        </div>

        {/* MENU */}
        <ul className="menu p-4 gap-1 flex flex-col flex-nowrap flex-1 overflow-y-auto overflow-x-hidden w-full">
          {menuItems.map((item, idx) => (
            <li key={idx} className="group relative">
              {item.subMenu ? (
                <details className="group">
                  <summary className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer">
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.text}</span>
                  </summary>
                  <ul className="ml-8 mt-1 flex flex-col gap-1">
                    {item.subMenu.map((sub, subIdx) => (
                      <li key={subIdx}>
                        <NavLink
                          to={sub.to}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 ${
                              isActive ? "bg-gray-800 font-semibold" : ""
                            }`
                          }
                          onClick={() => setOpen(false)}
                        >
                          <span className="text-lg">{sub.icon}</span>
                          <span>{sub.text}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 ${
                      isActive ? "bg-gray-800 font-semibold" : ""
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.text}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* OVERLAY for MOBILE */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
