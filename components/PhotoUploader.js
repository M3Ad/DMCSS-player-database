import { useState, useRef } from "react";
import Image from "next/image";
import { uploadAndUpdateProfilePhoto } from "../lib/uploadPhoto";
import styles from "./PhotoUploader.module.css";

export default function PhotoUploader({ userId, currentPhotoUrl, onUploadComplete }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Invalid file type. Please upload JPG, PNG, or WebP",
      });
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({
        type: "error",
        text: "File too large. Maximum size is 5MB",
      });
      return;
    }

    setSelectedFile(file);
    setMessage(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setMessage(null);

    const { url, success, error } = await uploadAndUpdateProfilePhoto(
      selectedFile,
      userId
    );

    setUploading(false);

    if (error || !success) {
      setMessage({
        type: "error",
        text: error?.message || "Upload failed. Please try again.",
      });
      return;
    }

    setMessage({
      type: "success",
      text: "Photo uploaded successfully!",
    });

    // Clear selection after success
    setTimeout(() => {
      setSelectedFile(null);
      setPreviewUrl(null);
      setMessage(null);
      if (onUploadComplete) {
        onUploadComplete(url);
      }
    }, 2000);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <label className={styles.uploadLabel}>Profile Photo</label>

      {currentPhotoUrl && !selectedFile && (
        <div className={styles.currentPhoto}>
          <div className={styles.currentPhotoLabel}>Current Photo:</div>
          <Image
            src={currentPhotoUrl}
            width={100}
            height={100}
            alt="Current profile"
            className={styles.currentPhotoPreview}
          />
        </div>
      )}

      <div
        className={`${styles.uploadArea} ${
          isDragging ? styles.uploadAreaActive : ""
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={styles.uploadIcon}>📷</div>
        <div className={styles.uploadText}>
          Click to upload or drag and drop
        </div>
        <div className={styles.uploadHint}>JPG, PNG or WebP (max 5MB)</div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleInputChange}
        className={styles.fileInput}
      />

      {previewUrl && (
        <div className={styles.previewContainer}>
          <img
            src={previewUrl}
            alt="Preview"
            className={styles.preview}
          />
          <div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={styles.uploadButton}
            >
              {uploading ? (
                <>
                  <span>⏳</span>
                  Uploading...
                </>
              ) : (
                <>
                  <span>✓</span>
                  Upload Photo
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={uploading}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`${styles.uploadMessage} ${
            message.type === "success"
              ? styles.uploadMessageSuccess
              : styles.uploadMessageError
          }`}
        >
          <span>{message.type === "success" ? "✓" : "⚠"}</span>
          {message.text}
        </div>
      )}
    </div>
  );
}
