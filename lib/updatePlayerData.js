import { supabase } from "./supabaseClient";

/**
 * Updates a user's profile in the profiles table
 * @param {string} userId - The user's UUID
 * @param {Object} profileData - Profile fields to update
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function updateUserProfile(userId, profileData) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: profileData.full_name,
        age: profileData.age ? parseInt(profileData.age) : null,
        position: profileData.position,
        photo_url: profileData.photo_url,
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Updates or inserts a player's card stats in the player_card table
 * @param {string} userId - The user's UUID
 * @param {Object} cardData - Card stats to update
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function updatePlayerCard(userId, cardData) {
  try {
    const { data, error } = await supabase
      .from("player_card")
      .upsert(
        {
          user_id: userId,
          pac: cardData.pac ? parseInt(cardData.pac) : null,
          sho: cardData.sho ? parseInt(cardData.sho) : null,
          pas: cardData.pas ? parseInt(cardData.pas) : null,
          dri: cardData.dri ? parseInt(cardData.dri) : null,
          def: cardData.def ? parseInt(cardData.def) : null,
          phy: cardData.phy ? parseInt(cardData.phy) : null,
        },
        {
          onConflict: "user_id",
        }
      )
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Updates or inserts a player's training program in the training_program table
 * @param {string} userId - The user's UUID
 * @param {Object} programData - Training program fields to update
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function updateTrainingProgram(userId, programData) {
  try {
    const { data, error } = await supabase
      .from("training_program")
      .upsert(
        {
          user_id: userId,
          season_goals: programData.season_goals || null,
          weekly_schedule: programData.weekly_schedule || null,
          strength_conditioning: programData.strength_conditioning || null,
          technical_tactical: programData.technical_tactical || null,
          coach_notes: programData.coach_notes || null,
        },
        {
          onConflict: "user_id",
        }
      )
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Updates all player data (profile, card, and training program) in one call
 * @param {string} userId - The user's UUID
 * @param {Object} playerData - Object containing profile, card, and program data
 * @returns {Promise<{success: boolean, errors: Array}>}
 */
export async function updateAllPlayerData(userId, playerData) {
  const errors = [];
  const results = {};

  // Update profile
  if (playerData.profile) {
    const { data: profileData, error: profileError } = await updateUserProfile(
      userId,
      playerData.profile
    );
    if (profileError) {
      errors.push({ table: "profile", error: profileError });
    } else {
      results.profile = profileData;
    }
  }

  // Update player card
  if (playerData.card) {
    const { data: cardData, error: cardError } = await updatePlayerCard(
      userId,
      playerData.card
    );
    if (cardError) {
      errors.push({ table: "player_card", error: cardError });
    } else {
      results.card = cardData;
    }
  }

  // Update training program
  if (playerData.program) {
    const { data: programData, error: programError } =
      await updateTrainingProgram(userId, playerData.program);
    if (programError) {
      errors.push({ table: "training_program", error: programError });
    } else {
      results.program = programData;
    }
  }

  return {
    success: errors.length === 0,
    errors,
    results,
  };
}
