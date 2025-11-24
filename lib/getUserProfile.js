import { supabase } from "./supabaseClient";

/**
 * Fetches the current authenticated user's profile from the profiles table
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 * Returns an object with data containing {full_name, age, position, photo_url} or error
 */
export async function getCurrentUserProfile() {
  try {
    // Get the current authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      return { data: null, error: authError };
    }

    if (!user) {
      return { data: null, error: new Error("No authenticated user found") };
    }

    // Fetch the user's profile from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, age, position, photo_url")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return { data: null, error: profileError };
    }

    return { data: profile, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
