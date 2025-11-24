import { supabase } from "./supabaseClient";

/**
 * Fetches the current authenticated user's training program from the training_program table
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 * Returns an object with data containing {season_goals, weekly_schedule, strength_conditioning, technical_tactical, coach_notes} or error
 */
export async function getCurrentUserTrainingProgram() {
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

    // Fetch the user's training program from the training_program table
    const { data: trainingProgram, error: programError } = await supabase
      .from("training_program")
      .select("season_goals, weekly_schedule, strength_conditioning, technical_tactical, coach_notes")
      .eq("user_id", user.id)
      .single();

    if (programError) {
      return { data: null, error: programError };
    }

    return { data: trainingProgram, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
