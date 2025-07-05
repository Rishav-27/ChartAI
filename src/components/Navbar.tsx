"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userInitial, setUserInitial] = useState("?");
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (user) {
        const name = user.user_metadata?.name || user.email?.split("@")[0];
        const first = name?.split(" ")[0] || "User";
        setUserName(first);
        setUserInitial(first.charAt(0).toUpperCase());
      }
    };

    fetchUser();
  }, []);

  const resetForm = () => {
    setForm({ name: "", email: "", password: "" });
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleLogin = async () => {
    setErrorMsg("");
    const { email, password } = form;

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("Invalid email or password.");
    } else {
      router.refresh();
      resetForm();
    }
  };

  const handleSignup = async () => {
    setErrorMsg("");
    const { name, email, password } = form;

    if (!name || !email || !password) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setErrorMsg("Signup failed. Try a different email.");
    } else {
      setSuccessMsg(
        "Signup successful! Please check your email to confirm and then log in."
      );
      setTab("login");
      resetForm();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserName(null);
    setUserInitial("?");
    resetForm();
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-extrabold tracking-tight select-none flex items-center gap-2">
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

            <span className="text-blue-700">Charts</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              AI
            </span>
          </h1>
        </div>

        {/* Center: Welcome quote */}
        <div className="flex-1 text-center mx-6 hidden md:flex flex-col items-center select-none">
          <p className="text-gray-600 italic text-sm md:text-base max-w-xl">
            <span className="text-purple-600 mr-2">“</span>
            Welcome to <span className="font-semibold text-blue-700">ChartsAI</span> — Build your charts effortlessly
            <span className="text-purple-600 ml-2">”</span>
          </p>
          <small className="mt-1 text-xs text-gray-400 font-mono">Visualize data like a pro 🚀</small>
        </div>

        {/* Right: User info and dropdown */}
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

            <DropdownMenuContent align="end" className="w-72 p-3 space-y-2">
              {userName ? (
                <>
                  <DropdownMenuItem className="hover:bg-gray-100 rounded text-sm px-2 py-1">
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-100 rounded text-sm px-2 py-1">
                    Library
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="hover:bg-gray-100 rounded text-sm px-2 py-1 cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <div className="flex justify-center text-sm gap-2 mb-1">
                    <button
                      onClick={() => setTab("login")}
                      className={`px-2 py-1 rounded ${
                        tab === "login" ? "bg-blue-100 font-semibold" : ""
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setTab("signup")}
                      className={`px-2 py-1 rounded ${
                        tab === "signup" ? "bg-blue-100 font-semibold" : ""
                      }`}
                    >
                      Signup
                    </button>
                  </div>

                  {tab === "signup" && (
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  )}

                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />

                  {errorMsg && <p className="text-xs text-red-600 pt-1">{errorMsg}</p>}
                  {successMsg && <p className="text-xs text-green-600 pt-1">{successMsg}</p>}

                  <button
                    onClick={tab === "signup" ? handleSignup : handleLogin}
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 rounded transition"
                  >
                    {tab === "signup" ? "Create Account" : "Login"}
                  </button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
