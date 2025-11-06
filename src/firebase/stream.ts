import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "./config";
import { uploadApi } from "./upload";
import { livepeerClient } from "../lib/livepeer";

interface CreateStreamData {
    creatorId: string;
    streamName: string;
    streamThumbnail?: string | File;
    category: string;
}

export const streamApi = {
    create: async function(streamData: CreateStreamData) {
        try {
            // Generate a unique stream ID
            const streamId = doc(collection(db, "streams")).id;
            
            // Create Livepeer stream first
            const livepeerResult = await livepeerClient.createBasicStream(
                streamData.streamName, 
                streamData.creatorId
            );
            
            if (!livepeerResult.success) {
                return { 
                    success: false, 
                    error: `Livepeer stream creation failed: ${livepeerResult.error}` 
                };
            }
            
            // Handle thumbnail upload if it's a File
            let thumbnailUrl: string | null = null;
            if (streamData.streamThumbnail) {
                if (streamData.streamThumbnail instanceof File) {
                    // Upload the file to Firebase Storage
                    const uploadResult = await uploadApi.uploadThumbnail(streamData.streamThumbnail, streamId);
                    if (uploadResult.success) {
                        thumbnailUrl = uploadResult.url!;
                    } else {
                        return { success: false, error: `Thumbnail upload failed: ${uploadResult.error}` };
                    }
                } else {
                    // It's already a URL string
                    thumbnailUrl = streamData.streamThumbnail;
                }
            }
            
            // Create stream document with Livepeer data
            const streamDoc = {
                id: streamId,
                creatorId: streamData.creatorId,
                streamName: streamData.streamName,
                streamThumbnail: thumbnailUrl,
                category: streamData.category,
                // Livepeer stream data
                playbackId: livepeerResult.data!.playbackId,
                streamKey: livepeerResult.data!.streamKey,
                livepeerStreamId: livepeerResult.data!.id,
                parentId: livepeerResult.data!.parentId,
                isActive: livepeerResult.data!.isActive,
                // Additional metadata
                createdAt: new Date().toISOString(),
                isLive: false,
                viewerCount: 0
            };

            // Save to Firestore
            await setDoc(doc(db, "streams", streamId), streamDoc);

            return { 
                success: true, 
                message: "Stream created successfully",
                streamId,
                data: streamDoc,
                livepeerData: livepeerResult.data
            };
        } catch (error) {
            const errorMessage = (error as Error).message;
            return { success: false, error: errorMessage };
        }
    }
}