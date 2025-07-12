"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaChevronDown, FaUser } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";

type User = {
  username: string;
};

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout function
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Don't show navbar until user is loaded
  if (!user) return null;

  return (
    <nav className="fixed top-7 left-1/2 transform -translate-x-1/2 z-50 backdrop-blur-xl shadow-lg border border-white/20 px-4 py-1 rounded-full flex gap-6 items-center text-[#6c4d6c] text-sm sm:text-base font-medium transition-all duration-300 hover:shadow-xl">
      <a
        href="/"
        className="hover:text-purple-900 transition-colors duration-200 hover:scale-105 transform"
      >
        Home
      </a>
      <a
        href="/logMood"
        className="hover:text-purple-900 transition-colors duration-200 hover:scale-105 transform"
      >
        Logs
      </a>
      <a
        href="/moods"
        className="hover:text-purple-900 transition-colors duration-200 hover:scale-105 transform"
      >
        Moods
      </a>

      {/* Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="flex items-center gap-2 hover:text-purple-900 transition-all duration-200 hover:scale-105 transform px-3 py-1.5 rounded-full hover:bg-white/30"
        >
          Profile
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-3 w-48 bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden z-50 border border-white/20 animate-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => {
                router.push("/profile");
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-purple-50 text-purple-700 font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <FaUser className="text-xs" />
              View Profile
            </button>
            <button
              onClick={() => {
                handleLogout();
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 font-medium transition-colors duration-200 border-t border-purple-100"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
