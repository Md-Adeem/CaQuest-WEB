import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import SearchBar from "./SearchBar";
import {
  HiMenu,
  HiX,
  HiLogout,
  HiHome,
  HiAcademicCap,
  HiCog,
  HiCreditCard,
  HiUser,
  HiChartBar,
  HiBookmark,
  HiSun,
  HiMoon,
  HiStar,
  HiArrowRight,
} from "react-icons/hi";
import { getInitials } from "../utils/helpers";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  const isAdminPage = location.pathname.startsWith("/admin");

  // Hero pages have special transparent navbar behavior
  const heroPages = ["/", "/about", "/contact", "/faq", "/blog", "/login", "/register"];
  const isOnHeroPage = heroPages.includes(location.pathname) || location.pathname.startsWith("/blog/");
  const useTransparent = isOnHeroPage && !scrolled;
  // In dark mode, hero backgrounds are dark → navbar needs white text
  // In light mode, hero backgrounds are light → navbar needs dark text
  const heroDark = useTransparent && isDarkMode;
  const heroLight = useTransparent && !isDarkMode;

  // Nav links for dark hero transparent state
  const navLinkDark = (path, specialActive) =>
    `text-[13px] font-semibold transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
      location.pathname === path
        ? specialActive || "text-white bg-white/20"
        : "text-white/70 hover:text-white hover:bg-white/10"
    }`;

  // Nav links for light hero transparent state
  const navLinkHeroLight = (path, specialActive) =>
    `text-[13px] font-semibold transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
      location.pathname === path
        ? specialActive || "text-indigo-700 bg-indigo-100"
        : "text-gray-600 hover:text-indigo-700 hover:bg-gray-200/50"
    }`;

  // Nav links for normal (scrolled/non-hero) state
  const navLinkNormal = (path, specialActive) =>
    `text-[13px] font-semibold transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
      location.pathname === path
        ? specialActive || "text-indigo-700 bg-indigo-100 dark:text-white dark:bg-white/20"
        : "text-gray-600 dark:text-white/70 hover:text-indigo-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
    }`;

  const getNavLink = (path, darkActive, lightActive, normalActive) => {
    if (heroDark) return navLinkDark(path, darkActive);
    if (heroLight) return navLinkHeroLight(path, lightActive);
    return navLinkNormal(path, normalActive);
  };

  // Colors for various elements based on state
  const textMuted = heroDark ? "text-white/60" : heroLight ? "text-gray-500" : "text-gray-500 dark:text-gray-400";
  const textMutedHover = heroDark ? "hover:text-white hover:bg-white/10" : heroLight ? "hover:text-gray-900 hover:bg-gray-200/50" : "hover:bg-gray-100 dark:hover:bg-gray-800";
  const pillBg = heroDark ? "bg-white/[0.08] border border-white/[0.08]" : heroLight ? "bg-gray-200/40 border border-gray-300/50" : "bg-gray-100 dark:bg-white/[0.08] border border-gray-200/50 dark:border-white/[0.08]";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      useTransparent
        ? "bg-transparent"
        : scrolled
          ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl shadow-lg shadow-black/5 dark:shadow-black/20 border-b border-gray-200/50 dark:border-gray-800/50"
          : "bg-white dark:bg-gray-950 border-b border-gray-200/50 dark:border-gray-800/50"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0 group">
            <img src="/logo.png" alt="CaQuest" className="h-10 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform" />
          </Link>

          {/* Search Bar (Desktop) */}
          {user && !isAdminPage && (
            <div className="hidden lg:block flex-1 max-w-xs xl:max-w-sm mx-4 xl:mx-8">
              <SearchBar />
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {loading ? (
              <div className="flex items-center gap-3 animate-pulse opacity-60">
                <div className="h-8 w-20 bg-gray-300/30 rounded-full"></div>
                <div className="h-8 w-24 bg-gray-300/30 rounded-full"></div>
              </div>
            ) : user ? (
              <>
                {!isAdminPage && (
                  <div className={`flex items-center gap-0.5 p-1 rounded-full mr-2 ${pillBg}`}>
                    <Link to="/dashboard" className={getNavLink("/dashboard")}>
                      <HiHome className="w-4 h-4" />
                      <span className="hidden xl:inline">Dashboard</span>
                    </Link>
                    <Link to="/progress" className={getNavLink("/progress")}>
                      <HiChartBar className="w-4 h-4" />
                      <span className="hidden xl:inline">Progress</span>
                    </Link>
                    <Link to="/bookmarks" className={getNavLink("/bookmarks")}>
                      <HiBookmark className="w-4 h-4" />
                      <span className="hidden xl:inline">Bookmarks</span>
                    </Link>
                    <Link to="/leaderboard" className={getNavLink(
                      "/leaderboard",
                      "text-yellow-300 bg-yellow-500/20",
                      "text-amber-700 bg-amber-100",
                      "text-amber-700 bg-amber-100 dark:text-yellow-300 dark:bg-yellow-500/20"
                    )}>
                      <HiStar className="w-4 h-4" />
                      <span className="hidden xl:inline">Ranks</span>
                    </Link>
                  </div>
                )}

                {user.role === "admin" && !isAdminPage && (
                  <Link to="/admin" className={getNavLink("/admin")}>
                    <HiCog className="w-4 h-4" /> Admin
                  </Link>
                )}

                {/* Streak */}
                {user.role === 'student' && user.currentStreak > 0 && (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-bold ml-1 transition-transform hover:scale-105 ${
                    heroDark ? "bg-orange-500/20 text-orange-300 border border-orange-400/20"
                    : "bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300 border border-orange-200 dark:border-orange-400/20"
                  }`} title={`${user.currentStreak} Day Streak!`}>
                    <span className="text-sm">🔥</span>
                    <span>{user.currentStreak}</span>
                  </div>
                )}

                {/* Theme Toggle */}
                <button onClick={toggleDarkMode}
                  className={`p-2 rounded-full transition-all ml-1 ${textMuted} ${textMutedHover}`}
                  aria-label="Toggle Dark Mode">
                  {isDarkMode ? <HiSun className="w-[18px] h-[18px]" /> : <HiMoon className="w-[18px] h-[18px]" />}
                </button>

                {/* Profile */}
                <div className="relative ml-1">
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center focus:outline-none rounded-full group">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center ring-2 ring-white/20 group-hover:ring-white/40 transition-all shadow-lg">
                      <span className="text-[11px] font-black text-white">{getInitials(user.name)}</span>
                    </div>
                  </button>

                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                      <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-gray-900/10 dark:shadow-black/30 border border-gray-200 dark:border-gray-800 z-20 animate-slide-up overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 pb-5">
                          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center mb-2 ring-2 ring-white/30">
                            <span className="text-sm font-black text-white">{getInitials(user.name)}</span>
                          </div>
                          <p className="text-sm font-bold text-white">{user.name}</p>
                          <p className="text-[11px] text-white/60 truncate">{user.email}</p>
                        </div>
                        <div className="p-1.5">
                          <Link to="/profile" onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                            <HiUser className="w-4 h-4 text-gray-400" /> My Profile
                          </Link>
                          <Link to="/subscriptions" onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                            <HiCreditCard className="w-4 h-4 text-gray-400" /> Subscriptions
                          </Link>
                          <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors">
                            <HiLogout className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={toggleDarkMode}
                  className={`p-2 rounded-full transition-all ${textMuted} ${textMutedHover}`}
                  aria-label="Toggle Dark Mode">
                  {isDarkMode ? <HiSun className="w-[18px] h-[18px]" /> : <HiMoon className="w-[18px] h-[18px]" />}
                </button>
                <Link to="/subscriptions" className={`text-[13px] font-semibold px-3 py-1.5 rounded-full transition-all ${
                  heroDark ? "text-white/70 hover:text-white hover:bg-white/10"
                  : heroLight ? "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}>Pricing</Link>
                <Link to="/login" className={`text-[13px] font-semibold px-3 py-1.5 rounded-full transition-all ${
                  heroDark ? "text-white/70 hover:text-white hover:bg-white/10"
                  : heroLight ? "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}>Sign In</Link>
                <Link to="/register" className={`font-bold text-[13px] px-5 py-2 rounded-full active:scale-95 transition-all shadow-md ${
                  heroDark ? "bg-white text-gray-900 hover:bg-gray-100"
                  : "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:scale-105 shadow-indigo-500/20"
                }`}>
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-full transition-all ${
              heroDark ? "text-white hover:bg-white/10"
              : heroLight ? "text-gray-700 hover:bg-gray-200/50"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}>
            {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden pb-4 animate-slide-up ${
            heroDark ? "border-t border-white/10"
            : heroLight ? "border-t border-gray-200/50"
            : "border-t border-gray-200/60 dark:border-gray-800/60"
          }`}>
            {loading ? (
              <div className="px-4 py-2 animate-pulse space-y-4 opacity-60">
                <div className="h-10 bg-gray-300/30 rounded-xl w-full"></div>
              </div>
            ) : user ? (
              <div className="space-y-1 pt-3">
                <div className="flex justify-between items-center px-3 mb-2">
                  <span className={`text-[11px] font-bold uppercase tracking-widest ${heroDark ? "text-white/40" : "text-gray-400"}`}>Theme</span>
                  <button onClick={toggleDarkMode}
                    className={`p-2 rounded-full transition-all ${
                      heroDark ? "text-white/60 hover:bg-white/10 bg-white/5"
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 bg-gray-50 dark:bg-gray-800"
                    }`}>
                    {isDarkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
                  </button>
                </div>
                {!isAdminPage && (<div className="px-3 mb-3"><SearchBar /></div>)}
                <div className={`mx-3 p-3 flex items-center gap-3 rounded-2xl mb-3 ${
                  heroDark ? "bg-white/[0.06] border border-white/[0.08]" : "bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60"
                }`}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center ring-2 ring-white/20">
                    <span className="text-sm font-black text-white">{getInitials(user.name)}</span>
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${heroDark ? "text-white" : "text-gray-900 dark:text-white"}`}>{user.name}</p>
                    <p className={`text-[11px] ${heroDark ? "text-white/50" : "text-gray-500 dark:text-gray-400"}`}>{user.email}</p>
                  </div>
                </div>
                {!isAdminPage && (
                  <>
                    <MobileLink to="/dashboard" icon={HiHome} label="Dashboard" onClick={() => setIsMenuOpen(false)} heroDark={heroDark} />
                    <MobileLink to="/progress" icon={HiChartBar} label="Progress" onClick={() => setIsMenuOpen(false)} heroDark={heroDark} />
                    <MobileLink to="/bookmarks" icon={HiBookmark} label="Bookmarks" onClick={() => setIsMenuOpen(false)} heroDark={heroDark} />
                    <MobileLink to="/leaderboard" icon={HiStar} label="Leaderboard" onClick={() => setIsMenuOpen(false)} heroDark={heroDark} />
                  </>
                )}
                <MobileLink to="/profile" icon={HiUser} label="Profile" onClick={() => setIsMenuOpen(false)} heroDark={heroDark} />
                <MobileLink to="/subscriptions" icon={HiCreditCard} label="Plans" onClick={() => setIsMenuOpen(false)} heroDark={heroDark} />
                {user.role === "admin" && (
                  <MobileLink to="/admin" icon={HiCog} label="Admin Panel" onClick={() => setIsMenuOpen(false)} heroDark={heroDark} />
                )}
                <button onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold mt-2 transition-colors ${
                    heroDark ? "text-rose-400 hover:bg-rose-500/10 border-t border-white/10" : "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 border-t border-gray-200/60 dark:border-gray-800/60"
                  }`}>
                  <HiLogout className="w-5 h-5" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2 px-2 pt-3">
                <div className="flex justify-between items-center px-2 mb-3">
                  <span className={`text-[11px] font-bold uppercase tracking-widest ${heroDark ? "text-white/40" : "text-gray-400"}`}>Theme</span>
                  <button onClick={toggleDarkMode}
                    className={`p-2 rounded-full transition-all ${
                      heroDark ? "text-white/60 hover:bg-white/10 bg-white/5" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 bg-gray-50 dark:bg-gray-800"
                    }`}>
                    {isDarkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
                  </button>
                </div>
                <Link to="/subscriptions" onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    heroDark ? "text-white/70 hover:bg-white/10" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}>Pricing</Link>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    heroDark ? "text-white/70 hover:bg-white/10" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}>Sign In</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}
                  className={`block mx-1 py-2.5 text-center text-sm font-bold rounded-full shadow-md ${
                    heroDark ? "bg-white text-gray-900" : "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white"
                  }`}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

const MobileLink = ({ to, icon: Icon, label, onClick, heroDark }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        isActive
          ? heroDark ? "bg-white/15 text-white" : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
          : heroDark ? "text-white/70 hover:bg-white/10 hover:text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
      }`}>
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );
};

export default Navbar;
