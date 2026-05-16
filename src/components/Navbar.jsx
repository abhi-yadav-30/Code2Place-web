import { Link, useNavigate, useLocation } from "react-router-dom";
import React,{ useEffect, useRef, useState } from "react";
import { Menu, X, LogOut, User, LayoutDashboard, Database, Brain } from "lucide-react";
import { getDomain } from "../utils/helper";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  // useEffect(() => {
  //   const handler = (e) => {
  //     e.preventDefault();
  //     setDeferredPrompt(e);
  //     setCanInstall(true);
  //   };
  //   window.addEventListener("beforeinstallprompt", handler);
  //   return () => window.removeEventListener("beforeinstallprompt", handler);
  // }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") console.log("Installed");
    setDeferredPrompt(null);
    setCanInstall(false);
  };

  const navLinks = [
    { name: "Home", path: "/", icon: LayoutDashboard },
    { name: "Questions", path: "/questions", icon: Database },
    { name: "AI Interview", path: "/ai-interview", icon: Brain },
    { name: "Resources", path: "/resources", icon: Database },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

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
    fetch(`${getDomain()}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/auth");
  };

  return (
    <nav className="h-20 glass fixed top-0 left-0 w-full z-50 flex items-center transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300 overflow-hidden">
            <img src="/C2P1.png" alt="Logo" className="w-full h-full object-contain p-1.5" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-orange-500 transition-colors">
            Code2Place
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg ${
                  isActive(link.path) ? "text-orange-500" : "text-gray-400 hover:text-white"
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-orange-500/10 rounded-lg -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-orange-500"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {canInstall && (
            <button
              onClick={installApp}
              className="bg-teal-600 hover:bg-teal-500 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-teal-500/20 transition-all active:scale-95"
            >
              Install App
            </button>
          )}

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setOpen(!open)}
                  className="group flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10 ring-2 ring-transparent group-hover:ring-orange-500/50 transition-all">
                    {user.name ? (
                      <span className="text-white font-bold">
                        {user.name[0].toUpperCase()}
                      </span>
                    ) : (
                      <User size={20} className="text-gray-400" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-4 w-56 glass border border-white/10 rounded-2xl py-2 shadow-2xl origin-top-right overflow-hidden shadow-black/50"
                    >
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Account</p>
                        <p className="text-sm font-semibold text-white truncate">{user.name || "User"}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-orange-500/10 rounded-xl transition-all"
                          onClick={() => setOpen(false)}
                        >
                          <User size={16} />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-gradient-to-r from-orange-500 to-rose-600 px-6 py-2.5 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-20 left-4 right-4 glass border border-white/10 rounded-3xl overflow-hidden md:hidden shadow-2xl z-50 p-4"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                    isActive(link.path)
                      ? "bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <link.icon size={20} />
                  {link.name}
                </Link>
              ))}

              {canInstall && (
                <button
                  onClick={installApp}
                  className="mt-2 w-full bg-teal-600 text-white px-4 py-4 rounded-2xl font-bold"
                >
                  Install App
                </button>
              )}

              <hr className="border-white/5 my-2" />

              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                  >
                    <User size={20} />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-all text-left"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="bg-gradient-to-r from-orange-500 to-rose-600 px-4 py-4 rounded-2xl text-white font-bold text-center shadow-lg shadow-orange-500/20"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
