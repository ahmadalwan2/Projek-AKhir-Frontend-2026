import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const MyNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const linkClass = ({ isActive }) =>
    `px-4 py-1 rounded-[8px] transition-all duration-200 ${
      isActive
        ? "bg-red-600 text-white shadow-[0_4px_15px_rgba(220,38,38,0.3)]"
        : "text-gray-300 hover:text-white hover:bg-white/10"
    }`;

  const checkUser = () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    setUser(currentUser);
  };

  useEffect(() => {
    checkUser();
    
    // Listen for storage changes (e.g. from other tabs)
    window.addEventListener("storage", checkUser);
    // Listen for custom event from Login page
    window.addEventListener("userUpdated", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("userUpdated", checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 
      backdrop-blur-md bg-black/60 
      border-b border-white/10 
      shadow-lg transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <NavLink to="/dashboard" className="hover:scale-105 transition-transform flex items-center">
          <img
            src="/logo-flixy-film.svg"
            alt="Flixy Logo"
            className="h-8 md:h-9 w-auto object-contain"
          />
        </NavLink>

        {/* MIDDLE LINKS */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/dashboard" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/movies" className={linkClass}>
            Movies
          </NavLink>
          
          {isAdmin && (
            <>
              <NavLink to="/add-movie" className={linkClass}>
                Add Movie
              </NavLink>
              <NavLink to="/admin" className={linkClass}>
                Admin
              </NavLink>
            </>
          )}

          <NavLink to="/profile" className={linkClass}>
            Profile
          </NavLink>
        </div>

        {/* RIGHT SIDE: USER & LOGOUT */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">{user.role}</span>
                <span className="text-sm text-white font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 border border-white/5 hover:border-transparent"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-red-600/20"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MyNavbar;