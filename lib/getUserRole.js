import { supabase } from "./supabaseClient";

/**
 * Fetches the current authenticated user's role from the profiles table
 * @returns {Promise<{role: string|null, error: Error|null}>}
 */
export async function getCurrentUserRole() {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { role: null, error: authError || new Error("No user found") };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return { role: null, error: profileError };
    }

    return { role: profile?.role || "player", error: null };
  } catch (error) {
    return { role: null, error };
  }
}
