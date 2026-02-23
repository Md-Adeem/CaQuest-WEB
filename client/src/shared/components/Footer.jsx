import React from "react";
import { HiAcademicCap } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6 bg-white p-3 rounded-xl inline-block shadow-sm">
              <img src="/logo.png" alt="CaQuest" className="h-20 w-auto object-contain" />
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              Your comprehensive platform for CA exam preparation. Practice
              chapter-wise questions for Foundation, Intermediate, and Final
              levels.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/dashboard"
                  className="hover:text-white transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/subscriptions"
                  className="hover:text-white transition-colors"
                >
                  Plans & Pricing
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">CA Levels</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/subjects/foundation"
                  className="hover:text-white transition-colors"
                >
                  Foundation
                </a>
              </li>
              <li>
                <a
                  href="/subjects/intermediate"
                  className="hover:text-white transition-colors"
                >
                  Intermediate
                </a>
              </li>
              <li>
                <a
                  href="/subjects/final"
                  className="hover:text-white transition-colors"
                >
                  Final
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} CaQuest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
