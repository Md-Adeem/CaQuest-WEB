import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
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
} from "react-icons/hi";
import { getInitials } from "../utils/helpers";

const Navbar = () => {
  const { user, logout } = useAuth();
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
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img src="/logo.png" alt="CaQuest" className="h-16 w-auto object-contain" />
          </Link>

          {/* Search Bar (Desktop) */}
          {user && !isAdminPage && (
            <div className="hidden lg:block flex-1 max-w-md mx-8">
              <SearchBar />
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {!isAdminPage && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`text-sm font-medium transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg ${
                        location.pathname === "/dashboard"
                          ? "text-primary-600 bg-primary-50"
                          : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                      }`}
                    >
                      <HiHome className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/progress"
                      className={`text-sm font-medium transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg ${
                        location.pathname === "/progress"
                          ? "text-primary-600 bg-primary-50"
                          : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                      }`}
                    >
                      <HiChartBar className="w-4 h-4" />
                      Progress
                    </Link>
                    <Link
                      to="/bookmarks"
                      className={`text-sm font-medium transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg ${
                        location.pathname === "/bookmarks"
                          ? "text-primary-600 bg-primary-50"
                          : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                      }`}
                    >
                      <HiBookmark className="w-4 h-4" />
                      Bookmarks
                    </Link>
                  </>
                )}

                {user.role === "admin" && !isAdminPage && (
                  <Link
                    to="/admin"
                    className="text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 flex items-center gap-1.5 px-3 py-2 rounded-lg"
                  >
                    <HiCog className="w-4 h-4" />
                    Admin
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative ml-2">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 focus:outline-none p-1 rounded-lg hover:bg-gray-50"
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
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 animate-slide-up">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <HiUser className="w-4 h-4" />
                          My Profile
                        </Link>
                        <Link
                          to="/subscriptions"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <HiCreditCard className="w-4 h-4" />
                          My Subscriptions
                        </Link>
                        <div className="border-t border-gray-100 mt-1 pt-1">
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
                <Link
                  to="/subscriptions"
                  className="text-gray-600 hover:text-primary-600 font-medium text-sm"
                >
                  Pricing
                </Link>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 font-medium text-sm"
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
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <HiX className="w-6 h-6 text-gray-600" />
            ) : (
              <HiMenu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-up">
            {user && (
              <div className="mb-3">
                <SearchBar />
              </div>
            )}

            {user ? (
              <div className="space-y-1">
                <div className="px-3 py-3 flex items-center space-x-3 bg-gray-50 rounded-lg mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-700">
                      {getInitials(user.name)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
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
                  className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm"
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
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );
};

export default Navbar;
