"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  userName: string | null;
  userInitial: string;
  onLogout: () => void;
}

export default function Navbar({
  userName,
  userInitial,
  onLogout,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-blue-600 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16h3v-6H3v6zm5 0h3v-10H8v10zm5 0h3v-4h-3v4zm5 0h3v-8h-3v8z"
              />
            </svg>
            <h1 className="text-3xl font-extrabold tracking-tight select-none">
              <span className="text-blue-700">Charts</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                AI
              </span>
            </h1>
          </Link>
        </div>

        <div className="flex-1 text-center mx-6 hidden md:flex flex-col items-center select-none">
          <p className="text-gray-600 italic text-sm md:text-base max-w-xl">
            <span className="text-purple-600 mr-2">“</span>
            Welcome to{" "}
            <span className="font-semibold text-blue-700">ChartsAI</span> —
            Build your charts effortlessly
            <span className="text-purple-600 ml-2">”</span>
          </p>
          <small className="mt-1 text-xs text-gray-400 font-mono">
            Visualize data like a pro 🚀
          </small>
        </div>

        <div className="flex items-center gap-6 min-w-[180px] justify-end">
          {userName && (
            <div className="text-right hidden sm:block leading-tight select-none">
              <p className="font-semibold text-lg">Hi, {userName} 👋</p>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold hover:opacity-90 transition">
                {userInitial}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 p-2 space-y-1">
              {userName ? (
                <>
                  <DropdownMenuItem className="hover:bg-gray-100 rounded text-sm px-2 py-1 cursor-pointer">
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-100 rounded text-sm px-2 py-1 cursor-pointer">
                    Library
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="hover:bg-gray-100 rounded text-sm px-2 py-1 cursor-pointer text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem className="hover:bg-gray-100 rounded text-sm px-2 py-1 cursor-pointer">
                    <Link href="/login" className="w-full h-full block">
                      Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-100 rounded text-sm px-2 py-1 cursor-pointer">
                    <Link href="/signup" className="w-full h-full block">
                      Sign Up
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
