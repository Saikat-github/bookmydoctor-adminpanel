import { LogOut, LogIn, BarChart2, Users, FileText, LayoutDashboard, UserCheck, TrendingUp, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import Logout from "./Logout";
import { AdminContext } from "../context/AdminContext";

export default function AdminNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentAdmin } = useContext(AdminContext);



  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard className="w-6 text-indigo-600" /> },
    { name: "Profiles", path: "/profiles", icon: <FileText className="w-6 text-indigo-600" /> },
    { name: "Accounts", path: "/accounts", icon: <UserCheck className="w-6 text-indigo-600" /> },
    { name: "Performance", path: "/performance", icon: <TrendingUp className="w-6 text-indigo-600" /> },
  ];


  const navigate = useNavigate()

  return (
    <nav className="bg-white shadow-md p-4 px-6 flex items-center justify-between">
      <div className="cursor-pointer text-xl sm:text-2xl sm:block bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent" onClick={() => navigate("/")}>
        <p >
          bookmydoctor.
        </p>
        <p className="text-xs">Admin Panel</p>
      </div>

      <div className="hidden md:flex space-x-10 items-center text-slate-700">
        {currentAdmin && navItems.map(({ name, path, icon }) => (
          <Link
            key={name}
            to={path}
            className={`flex items-center gap-2 md:gap-3 text-sm transition hover:border-indigo-600 pb-2 border-b-2 ${location.pathname === path ? "border-indigo-600" : "border-transparent"
              }`}
          >
            {icon}
            {name}
          </Link>
        ))}
        <Logout />
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-slate-700 focus:outline-none hover:cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-6" /> : <Menu className="w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-t shadow-md flex flex-col space-y-3 p-4 md:hidden z-50 h-screen text-slate-700">
          {currentAdmin && navItems.map(({ name, path, icon }) => (
            <Link
              key={name}
              to={path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full mr-auto flex items-center gap-2 md:gap-3 text-sm transition hover:border-indigo-600 pb-2 border-b-2 ${location.pathname === path ? "border-indigo-600" : "border-transparent"
                }`}
            >
              {icon}
              {name}
            </Link>
          ))}
          <Logout setIsMobileMenuOpen={setIsMobileMenuOpen} />
        </div>
      )}
    </nav>
  );
} 
