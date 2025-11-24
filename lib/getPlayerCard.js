import { supabase } from "./supabaseClient";

/**
 * Fetches the current authenticated user's player card stats from the player_card table
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 * Returns an object with data containing {pac, sho, pas, dri, def, phy} or error
 */
export async function getCurrentUserPlayerCard() {
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

    // Fetch the user's player card from the player_card table
    const { data: playerCard, error: cardError } = await supabase
      .from("player_card")
      .select("pac, sho, pas, dri, def, phy")
      .eq("user_id", user.id)
      .single();

    if (cardError) {
      return { data: null, error: cardError };
    }

    return { data: playerCard, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
