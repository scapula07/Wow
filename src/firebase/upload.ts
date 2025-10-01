import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";

interface UploadResult {
    success: boolean;
    url?: string;
    error?: string;
    fileName?: string;
}

export const uploadApi = {
    /**
     * Upload a file to Firebase Storage
     * @param file - The file to upload
     * @param folder - The folder path in storage (e.g., 'thumbnails', 'avatars')
     * @param fileName - Optional custom filename, if not provided uses file.name
     * @returns Promise with upload result
     */
    uploadFile: async function(
        file: File, 
        folder: string = 'uploads',
        fileName?: string
    ): Promise<UploadResult> {
        try {
            // Generate unique filename if not provided
            const finalFileName = fileName || `${Date.now()}_${file.name}`;
            const filePath = `${folder}/${finalFileName}`;
            
            // Create storage reference
            const storageRef = ref(storage, filePath);
            
            // Upload file
            const snapshot = await uploadBytes(storageRef, file);
            
            // Get download URL
            const downloadURL = await getDownloadURL(snapshot.ref);
            
            return {
                success: true,
                url: downloadURL,
                fileName: finalFileName
            };
        } catch (error) {
            const errorMessage = (error as Error).message;
            return {
                success: false,
                error: errorMessage
            };
        }
    },

    /**
     * Upload thumbnail image for streams
     * @param file - The image file to upload
     * @param streamId - The stream ID to associate with the thumbnail
     * @returns Promise with upload result
     */
    uploadThumbnail: async function(file: File, streamId: string): Promise<UploadResult> {
        const fileName = `${streamId}_thumbnail_${Date.now()}.${file.name.split('.').pop()}`;
        return this.uploadFile(file, 'thumbnails', fileName);
    },

    /**
     * Upload user avatar
     * @param file - The image file to upload
     * @param userId - The user ID to associate with the avatar
     * @returns Promise with upload result
     */
    uploadAvatar: async function(file: File, userId: string): Promise<UploadResult> {
        const fileName = `${userId}_avatar_${Date.now()}.${file.name.split('.').pop()}`;
        return this.uploadFile(file, 'avatars', fileName);
    },

    /**
     * Delete a file from Firebase Storage
     * @param fileUrl - The full download URL or file path
     * @returns Promise with deletion result
     */
    deleteFile: async function(fileUrl: string): Promise<{ success: boolean; error?: string }> {
        try {
            const fileRef = ref(storage, fileUrl);
            await deleteObject(fileRef);
            
            return { success: true };
        } catch (error) {
            const errorMessage = (error as Error).message;
            return {
                success: false,
                error: errorMessage
            };
        }
    }
};