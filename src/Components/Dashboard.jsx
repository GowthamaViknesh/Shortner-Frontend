import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import {
  ChevronDown,
  Menu,
  X,
  Home,
  Users,
  Settings,
  FileText,
  LogOut,
  User,
} from "lucide-react";
import { Profile } from "../Pages/Profile";
import OverallDash from "../Pages/OverAllDash";
import Analytics from "../Pages/Analytics";
import Reports from "../Pages/Report";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Dashboard");

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleProfileDropdown = useCallback(() => {
    setIsProfileOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("#profile-dropdown")) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { title: "Dashboard", icon: Home },
    { title: "Analytics", icon: Users },
    { title: "Reports", icon: FileText },
    { title: "Profile", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md fixed w-full z-10">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <span className="text-xl font-bold text-blue-600">ShortnerApp</span>
          </div>

          <div className="relative">
            <button
              id="profile-dropdown"
              onClick={toggleProfileDropdown}
              className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg"
            >
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user?.displayName?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <span className="hidden md:block">
                {user?.displayName || "User"}
              </span>
              <ChevronDown size={20} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                <button className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100">
                  <User size={16} />
                  <span>Profile</span>
                </button>
                <button
                  className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <aside
        className={`fixed left-0 top-0 mt-16 h-full bg-white shadow-lg transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <div className="py-8">
          {isSidebarOpen && (
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.title}>
                    <button
                      className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 ${
                        activePage === item.title ? "bg-gray-200" : ""
                      }`}
                      onClick={() => setActivePage(item.title)}
                    >
                      <Icon size={20} />
                      <span>{item.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      <main
        className={`pt-20 min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="p-6 absolute">
          {activePage === "Dashboard" && <OverallDash />}
          {activePage === "Analytics" && <Analytics />}
          {activePage === "Reports" && <Reports />}
          {activePage === "Profile" && (
            <Profile user={user} handleLogout={handleLogout} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
