// lib/useAuthUser.ts (or a more descriptive path like hooks/useAuthUser.ts)
"use client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
// IMPORT THE CORRECT CLIENT HERE:
import { createClient } from "@/utils/supabase/client"; // Use your modern browser client

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null); // Consider using Supabase's User type

  useEffect(() => {
    const supabase = createClient(); // Initialize client inside useEffect or memoize

    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };

    getUser(); // Fetch user on initial mount

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup the subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this runs once on mount

  return user;
}