import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./config";

export interface CensoredStreamInfo {
  streamId: string;
  streamName: string;
  censorshipCount: number;
  reasons: string[];
  censoredAt: any;
}

/**
 * Get all censored streams by a specific user
 */
export const getUserCensoredStreams = async (userId: string): Promise<CensoredStreamInfo[]> => {
  try {
    const streamsRef = collection(db, "streams");
    const q = query(
      streamsRef,
      where("creatorId", "==", userId),
      where("isCensored", "==", true)
    );

    const querySnapshot = await getDocs(q);
    
    const censoredStreams: CensoredStreamInfo[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      censoredStreams.push({
        streamId: doc.id,
        streamName: data.streamName || "Untitled Stream",
        censorshipCount: data.censorshipCount || 0,
        reasons: [], // We'll fetch reasons from userBlocks collection if needed
        censoredAt: data.censoredAt,
      });
    });

    return censoredStreams;
  } catch (error) {
    console.error("Error fetching censored streams:", error);
    return [];
  }
};

/**
 * Get the most common blocking reasons for a stream
 */
export const getStreamBlockReasons = async (streamId: string): Promise<string[]> => {
  try {
    const userBlocksRef = collection(db, "userBlocks");
    const querySnapshot = await getDocs(userBlocksRef);
    
    const reasonCounts: Record<string, number> = {};
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const blockedStreams = data.blockedStreams || [];
      
      blockedStreams.forEach((block: any) => {
        if (block.streamId === streamId && block.reason) {
          reasonCounts[block.reason] = (reasonCounts[block.reason] || 0) + 1;
        }
      });
    });

    // Sort reasons by frequency
    const sortedReasons = Object.entries(reasonCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([reason]) => reason);

    return sortedReasons;
  } catch (error) {
    console.error("Error fetching block reasons:", error);
    return [];
  }
};

/**
 * Format reason for display
 */
export const formatBlockReason = (reason: string): string => {
  const reasonMap: Record<string, string> = {
    inappropriate: "Inappropriate content",
    spam: "Spam or misleading",
    harassment: "Harassment or hate speech",
    violence: "Violence or dangerous content",
    copyright: "Copyright infringement",
    other: "Other violations",
  };

  return reasonMap[reason] || reason;
};
