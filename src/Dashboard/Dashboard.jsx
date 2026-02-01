import React, { useEffect, useState } from "react";
import {
  FaFolderOpen,
  FaRunning,
  FaCalendarDay,
  FaCalendarAlt,
  FaCheckCircle,
  FaStickyNote,
  FaRegCalendarCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const dashboardCards = [
  {
    title: "All Cases",
    icon: <FaFolderOpen className="text-3xl text-white" />,
    bg: "bg-blue-500",
    api: "/dashboard/all-cases-count",
  },
  {
    title: "Running Cases",
    icon: <FaRunning className="text-3xl text-white" />,
    bg: "bg-green-500",
    api: "/dashboard/running-cases-count",
  },
  {
    title: "Today's Cases",
    icon: <FaCalendarDay className="text-3xl text-white" />,
    bg: "bg-yellow-500",
    api: "/dashboard/todays-cases-count",
  },
  {
    title: "Tomorrow's Cases",
    icon: <FaCalendarAlt className="text-3xl text-white" />,
    bg: "bg-indigo-500",
    api: "/dashboard/tomorrows-cases-count",
  },
  {
    title: "Complete Cases",
    icon: <FaCheckCircle className="text-3xl text-white" />,
    bg: "bg-purple-500",
    api: "/dashboard/completed-cases-count",
  },
  {
    title: "All Notes",
    icon: <FaStickyNote className="text-3xl text-white" />,
    bg: "bg-pink-500",
    api: "/dashboard/all-notes-count",
  },
  {
    title: "Today's Notes",
    icon: <FaRegCalendarCheck className="text-3xl text-white" />,
    bg: "bg-orange-500",
    api: "/dashboard/todays-notes-count",
  },
  {
    title: "Not Updated Cases",
    icon: <FaExclamationTriangle className="text-3xl text-white" />,
    bg: "bg-red-500",
    api: "/dashboard/pending-cases-count",
  },
];

const Dashboard = () => {
  const [counts, setCounts] = useState({});
  const axiosSecure = useAxiosSecure();

  const fetchCount = async (card) => {
    try {
      const res = await axiosSecure.get(card.api);
      setCounts((prev) => ({ ...prev, [card.title]: res.data.count }));
    } catch (err) {
      console.error(`Failed to fetch ${card.title}`, err);
    }
  };

  useEffect(() => {
    // Initial load
    dashboardCards.forEach((card) => fetchCount(card));

    // Refresh every 10 seconds individually
    const intervals = dashboardCards.map((card) =>
      setInterval(() => fetchCount(card), 10000)
    );

    return () => intervals.forEach((id) => clearInterval(id));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Control Panel Overview</p>
      </header>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, idx) => (
          <div
            key={idx}
            className={`flex items-center p-6 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition duration-200 ${card.bg}`}
          >
            <div className="mr-4">{card.icon}</div>
            <div>
              <h2 className="text-white font-semibold text-lg">{card.title}</h2>
              <p className="text-white font-bold text-2xl mt-1">
                {counts[card.title] !== undefined ? counts[card.title] : "..."}
              </p>
              <p className="text-white text-sm mt-1">View Details</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Summary */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h3 className="text-gray-700 font-semibold mb-2">Quick Summary</h3>
          <ul className="text-gray-600 space-y-1">
            <li>All Cases: {counts["All Cases"] || "..."}</li>
            <li>Running Cases: {counts["Running Cases"] || "..."}</li>
            <li>Pending Cases: {counts["Not Updated Cases"] || "..."}</li>
            <li>Completed Cases: {counts["Complete Cases"] || "..."}</li>
          </ul>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h3 className="text-gray-700 font-semibold mb-2">Today's Overview</h3>
          <ul className="text-gray-600 space-y-1">
            <li>Today's Cases: {counts["Today's Cases"] || "..."}</li>
            <li>Today's Notes: {counts["Today's Notes"] || "..."}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
