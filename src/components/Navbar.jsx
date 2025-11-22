import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/"
        ? "text-orange-400 font-semibold underline underline-offset-4"
        : "text-gray-300";
    }
    return location.pathname.startsWith(path)
      ? "text-orange-400 font-semibold underline underline-offset-4"
      : "text-gray-300";
  };

  // close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/auth");
  };

  return (
    <nav className="h-16 bg-[#1e1e1e] border-b border-gray-700 fixed top-0 w-full z-50 flex items-center shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-500 underline">
          Code2Place
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8 text-gray-300 font-medium">
          <Link to="/" className={`${isActive("/")} hover:text-orange-300`}>
            Home
          </Link>

          <Link
            to="/questions"
            className={`${isActive("/questions")} hover:text-orange-300`}
          >
            Questions
          </Link>

          <Link
            to="/ai-interview"
            className={`${isActive("/ai-interview")} hover:text-orange-300`}
          >
            AI Interview
          </Link>

          <Link
            to="/resources"
            className={`${isActive("/resources")} hover:text-orange-300`}
          >
            Resources
          </Link>
        </div>

        {/* Profile + Login (Desktop) */}
        <div className="hidden md:block relative" ref={dropdownRef}>
          {user ? (
            <>
              <button
                onClick={() => setOpen(!open)}
                className="ml-4 flex items-center gap-2 text-gray-300 hover:text-white"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-700">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
              </button>

              {open && (
                <div
                  className="absolute right-0 mt-3 w-48 bg-[#202020] shadow-lg border border-gray-700 rounded-lg py-2 text-gray-200 
                  animate-fadeIn transform origin-top transition-all duration-200 scale-100 opacity-100"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-[#3b3b3b] rounded"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-[#3b3b3b] rounded"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/auth"
              className="ml-4 bg-orange-600 px-4 py-2 rounded text-white hover:bg-orange-700 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        {!menuOpen && (
          <button
            className="md:hidden text-gray-300 flex items-center justify-center p-2 
             rounded-md border border-gray-700 bg-[#2a2a2a]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={26} />
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="  md:hidden  bg-[#202020] border border-gray-600 rounded-lg
               px-3 pb-4 pt-2 mr-1 mt-40 top-0 flex flex-row-reverse  text-gray-200 animate-slideDown"
        >
          <button
            className="md:hidden text-gray-300 flex items-center justify-center p-2
             rounded-md border border-gray-700 bg-[#2a2a2a] h-10"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <X size={26} />
          </button>
          <div className="space-y-2 w-27">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`${isActive("/")} block`}
            >
              Home
            </Link>

            <Link
              to="/questions"
              onClick={() => setMenuOpen(false)}
              className={`${isActive("/questions")} block`}
            >
              Questions
            </Link>

            <Link
              to="/ai-interview"
              onClick={() => setMenuOpen(false)}
              className={`${isActive("/ai-interview")} block`}
            >
              AI Interview
            </Link>

            <Link
              to="/resources"
              onClick={() => setMenuOpen(false)}
              className={`${isActive("/resources")} block`}
            >
              Resources
            </Link>

            {user ? (
              <>
                <hr className="border-gray-600" />

                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-300"
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-left text-gray-300 w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMenuOpen(false)}
                className="bg-orange-600 px-4 py-2 rounded text-white block text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
