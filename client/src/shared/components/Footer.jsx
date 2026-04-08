import React from "react";
import { Link } from "react-router-dom";
import { HiMail, HiPhone, HiLocationMarker, HiHeart } from "react-icons/hi";

const Footer = () => {
  const quickLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Pricing", href: "/subscriptions" },
    { label: "About Us", href: "/about" },
    { label: "FAQs", href: "/faq" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  const caLevels = [
    { label: "Foundation", href: "/subjects/foundation" },
    { label: "Intermediate", href: "/subjects/intermediate" },
    { label: "Final", href: "/subjects/final" },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Top gradient accent line */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

      {/* Newsletter / CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-0">
        <div className="relative bg-gray-900 dark:bg-gray-800 rounded-none md:rounded-b-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none"></div>
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Ready to ace your CA exams?</h3>
            <p className="text-gray-400 text-sm">Join 2,000+ students already preparing with CaQuest</p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-3">
            <Link to="/register" className="bg-white text-gray-900 font-bold text-sm px-7 py-3 rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl active:scale-95">
              Start Free Trial
            </Link>
            <Link to="/subscriptions" className="bg-white/10 text-white font-semibold text-sm px-7 py-3 rounded-full border border-white/10 hover:bg-white/20 transition-all">
              View Plans
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-block mb-5">
              <img src="/logo.png" alt="CaQuest" className="h-14 w-auto object-contain" />
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mb-6">
              Your comprehensive platform for CA exam preparation. Practice
              chapter-wise questions for Foundation, Intermediate, and Final levels.
            </p>
            {/* Contact info */}
            <div className="space-y-3">
              {[
                { icon: <HiMail className="w-4 h-4" />, text: "helpcaquest@gmail.com" },
                { icon: <HiPhone className="w-4 h-4" />, text: "+91 6203793113" },
                { icon: <HiLocationMarker className="w-4 h-4" />, text: "Ahmedabad, Gujarat, India" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-indigo-500 dark:text-indigo-400">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-5 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CA Levels */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-5 uppercase tracking-wider">CA Levels</h3>
            <ul className="space-y-3">
              {caLevels.map((level, i) => (
                <li key={i}>
                  <Link to={level.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {level.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-5 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              {[
                { label: "Privacy Policy", href: "/about" },
                { label: "Terms of Service", href: "/about" },
                { label: "Refund Policy", href: "/about" },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} CaQuest. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
            Made with <HiHeart className="w-3.5 h-3.5 text-rose-500" /> for CA Students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
