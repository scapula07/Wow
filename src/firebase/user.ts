import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./config";
import { uploadApi } from "./upload";

interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: "M" | "F" | "";
  photoURL?: string;
  coverImageURL?: string;
  followerCount?: number;
  followingCount?: number;
  [key: string]: any; // Allow additional fields
}

/**
 * User API for managing user documents and file uploads
 * 
 * Example usage:
 * 
 * // Update user with text data only
 * await userApi.update('user123', { firstName: 'John', bio: 'New bio' });
 * 
 * // Update user with files
 * const files = { profilePhoto: profileFile, coverImage: coverFile };
 * await userApi.updateWithFiles('user123', { firstName: 'John' }, files);
 * 
 * // Upload profile photo only
 * const result = await userApi.uploadProfilePhoto(file, 'user123');
 * 
 * // Get user data
 * const user = await userApi.get('user123');
 */

export const userApi = {
  // Upload profile photo
  uploadProfilePhoto: async function(file: File, userId: string) {
    try {
      if (!file || !userId) {
        throw new Error("File and user ID are required");
      }

      const fileName = `${userId}_profile_${Date.now()}.${file.name.split('.').pop()}`;
      const result = await uploadApi.uploadFile(file, 'profile-images', fileName);

      if (!result.success) {
        throw new Error(result.error || "Failed to upload profile photo");
      }

      return {
        success: true,
        photoURL: result.url,
        fileName: result.fileName,
      };
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      throw new Error(`Failed to upload profile photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Upload cover image
  uploadCoverImage: async function(file: File, userId: string) {
    try {
      if (!file || !userId) {
        throw new Error("File and user ID are required");
      }

      const fileName = `${userId}_cover_${Date.now()}.${file.name.split('.').pop()}`;
      const result = await uploadApi.uploadFile(file, 'cover-images', fileName);

      if (!result.success) {
        throw new Error(result.error || "Failed to upload cover image");
      }

      return {
        success: true,
        coverImageURL: result.url,
        fileName: result.fileName,
      };
    } catch (error) {
      console.error("Error uploading cover image:", error);
      throw new Error(`Failed to upload cover image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Update user with file uploads
  updateWithFiles: async function(
    userId: string, 
    userData: UserUpdateData, 
    files?: { profilePhoto?: File; coverImage?: File }
  ) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      let updatedData = { ...userData };

      // Upload profile photo if provided
      if (files?.profilePhoto) {
        const photoResult = await this.uploadProfilePhoto(files.profilePhoto, userId);
        updatedData.photoURL = photoResult.photoURL;
      }

      // Upload cover image if provided
      if (files?.coverImage) {
        const coverResult = await this.uploadCoverImage(files.coverImage, userId);
        updatedData.coverImageURL = coverResult.coverImageURL;
      }

      // Update user document with new URLs
      const updateResult = await this.update(userId, updatedData);

      return {
        success: true,
        message: "User updated successfully with files",
        data: updateResult.data,
      };
    } catch (error) {
      console.error("Error updating user with files:", error);
      throw new Error(`Failed to update user with files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  update: async function(userId: string, userData: UserUpdateData) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      // Get reference to the user document
      const userDocRef = doc(db, "users", userId);
      
      // Add timestamp for when the update occurred
      const updateData = {
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      // Update the document
      await updateDoc(userDocRef, updateData);
      
      return {
        success: true,
        message: "User updated successfully",
        data: updateData,
      };
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Helper function to get user data
  get: async function(userId: string) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error("User not found");
      }

      return {
        success: true,
        data: {
          id: userDoc.id,
          ...userDoc.data(),
        },
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error(`Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Helper function to create or update user document
  createOrUpdate: async function(userId: string, userData: UserUpdateData) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const userDocRef = doc(db, "users", userId);
      
      // Add timestamps
      const documentData = {
        ...userData,
        updatedAt: new Date().toISOString(),
        createdAt: userData.createdAt || new Date().toISOString(),
      };

      // Use setDoc with merge to create or update
      await setDoc(userDocRef, documentData, { merge: true });
      
      return {
        success: true,
        message: "User created or updated successfully",
        data: documentData,
      };
    } catch (error) {
      console.error("Error creating/updating user:", error);
      throw new Error(`Failed to create/update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}