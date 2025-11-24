import { supabase } from "./supabaseClient";

/**
 * Uploads a player profile photo to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} userId - The user's UUID
 * @returns {Promise<{url: string|null, error: Error|null}>}
 */
export async function uploadProfilePhoto(file, userId) {
  try {
    // Validate file
    if (!file) {
      return { url: null, error: new Error("No file provided") };
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return {
        url: null,
        error: new Error("Invalid file type. Please upload JPG, PNG, or WebP"),
      };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        url: null,
        error: new Error("File too large. Maximum size is 5MB"),
      };
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `profile-photos/${fileName}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from("player-photos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return { url: null, error: uploadError };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("player-photos").getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (error) {
    return { url: null, error };
  }
}

/**
 * Updates the user's profile with a new photo URL
 * @param {string} userId - The user's UUID
 * @param {string} photoUrl - The public URL of the uploaded photo
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export async function updateProfilePhotoUrl(userId, photoUrl) {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ photo_url: photoUrl })
      .eq("id", userId);

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Uploads a photo and updates the profile in one operation
 * @param {File} file - The image file to upload
 * @param {string} userId - The user's UUID
 * @returns {Promise<{url: string|null, success: boolean, error: Error|null}>}
 */
export async function uploadAndUpdateProfilePhoto(file, userId) {
  try {
    // Upload the file
    const { url, error: uploadError } = await uploadProfilePhoto(file, userId);

    if (uploadError || !url) {
      return { url: null, success: false, error: uploadError };
    }

    // Update the profile
    const { success, error: updateError } = await updateProfilePhotoUrl(
      userId,
      url
    );

    if (updateError || !success) {
      return { url, success: false, error: updateError };
    }

    return { url, success: true, error: null };
  } catch (error) {
    return { url: null, success: false, error };
  }
}

/**
 * Deletes a photo from storage (optional cleanup)
 * @param {string} photoUrl - The public URL of the photo to delete
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export async function deleteProfilePhoto(photoUrl) {
  try {
    // Extract file path from public URL
    const urlParts = photoUrl.split("/");
    const filePath = `profile-photos/${urlParts[urlParts.length - 1]}`;

    const { error } = await supabase.storage
      .from("player-photos")
      .remove([filePath]);

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error };
  }
}
