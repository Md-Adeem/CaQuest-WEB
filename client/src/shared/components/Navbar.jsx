import React, { useState } from "react";
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
} from "react-icons/hi";
import { getInitials } from "../utils/helpers";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  // Don't show navbar on admin pages (admin has sidebar)
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img src="/logo.png" alt="CaQuest" className="h-16 w-auto object-contain" />
          </Link>

          {/* Search Bar (Desktop) */}
          {user && !isAdminPage && (
            <div className="hidden lg:block flex-1 max-w-xs xl:max-w-md mx-4 xl:mx-8">
              <SearchBar />
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-4">
            {user ? (
              <>
                {!isAdminPage && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`text-sm font-medium transition-colors flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-2 rounded-lg ${
                        location.pathname === "/dashboard"
                          ? "text-primary-600 bg-primary-50"
                          : "text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-50 dark:bg-gray-900"
                      }`}
                    >
                      <HiHome className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/progress"
                      className={`text-sm font-medium transition-colors flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-2 rounded-lg ${
                        location.pathname === "/progress"
                          ? "text-primary-600 bg-primary-50"
                          : "text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-50 dark:bg-gray-900"
                      }`}
                    >
                      <HiChartBar className="w-4 h-4" />
                      Progress
                    </Link>
                    <Link
                      to="/bookmarks"
                      className={`text-sm font-medium transition-colors flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-2 rounded-lg ${
                        location.pathname === "/bookmarks"
                          ? "text-primary-600 bg-primary-50"
                          : "text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-50 dark:bg-gray-900"
                      }`}
                    >
                      <HiBookmark className="w-4 h-4" />
                      Bookmarks
                    </Link>
                    <Link
                      to="/leaderboard"
                      className={`text-sm font-medium transition-colors flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-2 rounded-lg ${
                        location.pathname === "/leaderboard"
                          ? "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/30"
                          : "text-gray-600 dark:text-gray-300 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
                      }`}
                    >
                      <HiStar className="w-4 h-4" />
                      Leaderboard
                    </Link>
                  </>
                )}

                {user.role === "admin" && !isAdminPage && (
                  <Link
                    to="/admin"
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-50 dark:bg-gray-900 flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-2 rounded-lg"
                  >
                    <HiCog className="w-4 h-4" />
                    Admin
                  </Link>
                )}

                {/* Gamification Streak Badge */}
                {user.role === 'student' && user.currentStreak > 0 && (
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full text-sm font-bold ml-2 border border-orange-100 dark:border-orange-800/50 shadow-sm transition-transform hover:scale-105" title={`${user.currentStreak} Day Study Streak!`}>
                    <span className="text-base leading-none">🔥</span>
                    <span>{user.currentStreak}</span>
                  </div>
                )}

                {/* Theme Toggle Button (Desktop User) */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors ml-2 flex-shrink-0"
                  aria-label="Toggle Dark Mode"
                >
                  {isDarkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
                </button>

                {/* Profile Dropdown */}
                <div className="relative ml-2">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 focus:outline-none p-1 rounded-lg hover:bg-gray-50 dark:bg-gray-900"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-700">
                        {getInitials(user.name)}
                      </span>
                    </div>
                  </button>

                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsProfileOpen(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-20 animate-slide-up">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:bg-gray-900"
                        >
                          <HiUser className="w-4 h-4" />
                          My Profile
                        </Link>
                        <Link
                          to="/subscriptions"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:bg-gray-900"
                        >
                          <HiCreditCard className="w-4 h-4" />
                          My Subscriptions
                        </Link>
                        <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                          >
                            <HiLogout className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Theme Toggle Button (Desktop Guest) */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors mr-2 flex-shrink-0"
                  aria-label="Toggle Dark Mode"
                >
                  {isDarkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
                </button>
                <Link
                  to="/subscriptions"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 font-medium text-sm px-2 xl:px-3"
                >
                  Pricing
                </Link>
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 font-medium text-sm px-2 xl:px-3"
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm !py-2">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:bg-gray-800"
          >
            {isMenuOpen ? (
              <HiX className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <HiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-gray-800 animate-slide-up">
            {!user && (
              <div className="flex justify-between items-center px-4 mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Toggle Theme</span>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 bg-gray-50 dark:bg-gray-800 transition-colors"
                >
                  {isDarkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
                </button>
              </div>
            )}
            {user && (
              <div className="mb-3">
                <SearchBar />
              </div>
            )}

            {user ? (
              <div className="space-y-1">
                <div className="flex justify-between items-center px-3 mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Theme</span>
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 bg-gray-50 dark:bg-gray-800 transition-colors"
                  >
                    {isDarkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
                  </button>
                </div>
                <div className="px-3 py-3 flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-700">
                      {getInitials(user.name)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <MobileLink
                  to="/dashboard"
                  icon={HiHome}
                  label="Dashboard"
                  onClick={() => setIsMenuOpen(false)}
                />
                <MobileLink
                  to="/progress"
                  icon={HiChartBar}
                  label="Progress"
                  onClick={() => setIsMenuOpen(false)}
                />
                <MobileLink
                  to="/bookmarks"
                  icon={HiBookmark}
                  label="Bookmarks"
                  onClick={() => setIsMenuOpen(false)}
                />
                <MobileLink
                  to="/leaderboard"
                  icon={HiStar}
                  label="Leaderboard"
                  onClick={() => setIsMenuOpen(false)}
                />
                <MobileLink
                  to="/profile"
                  icon={HiUser}
                  label="Profile"
                  onClick={() => setIsMenuOpen(false)}
                />
                <MobileLink
                  to="/subscriptions"
                  icon={HiCreditCard}
                  label="Plans"
                  onClick={() => setIsMenuOpen(false)}
                />
                {user.role === "admin" && (
                  <MobileLink
                    to="/admin"
                    icon={HiCog}
                    label="Admin Panel"
                    onClick={() => setIsMenuOpen(false)}
                  />
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 text-sm"
                >
                  <HiLogout className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/subscriptions"
                  className="block px-3 py-2 rounded-lg hover:bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-lg hover:bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 btn-primary text-center text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
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

const MobileLink = ({ to, icon: Icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
        isActive
          ? "bg-primary-50 text-primary-700 font-semibold"
          : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:bg-gray-900"
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );
};

export default Navbar;
