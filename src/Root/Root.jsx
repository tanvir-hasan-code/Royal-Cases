import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

const Root = () => {
  return (
    <div className="h-screen flex flex-col">

      {/* TOP NAVBAR (STATIC) */}
      <Navbar />

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT SIDE (NAME + LINKS) */}
        <aside className=" bg-slate-800 text-white">
          <Sidebar />
        </aside>

        {/* RIGHT SIDE (CONTENT CHANGE HERE) */}
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>

      {/* FOOTER (optional) */}
       {/* <Footer />  */}

    </div>
  );
};

export default Root;
