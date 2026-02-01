import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

const Root = () => {
  return (
    <div className="h-screen flex flex-col">

 
      <Navbar />

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

     
        <aside className=" bg-slate-800 text-white">
          <Sidebar />
        </aside>

      
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default Root;
