import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  increment, 
  getDoc,
  setDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";

// Threshold for auto-hiding streams from all users
const CENSORSHIP_THRESHOLD = 10;

interface BlockStreamParams {
  streamId: string;
  userId: string;
  reason: string;
}

interface BlockedStream {
  streamId: string;
  reason: string;
  blockedAt: any;
}

/**
 * Block a stream for a specific user and increment censorship count
 */
export const blockStream = async ({ streamId, userId, reason }: BlockStreamParams) => {
  try {
    // 1. Add stream to user's blocked list
    const userBlocksRef = doc(db, "userBlocks", userId);
    const userBlocksDoc = await getDoc(userBlocksRef);

    const blockData: BlockedStream = {
      streamId,
      reason,
      blockedAt: serverTimestamp(),
    };

    if (userBlocksDoc.exists()) {
      await updateDoc(userBlocksRef, {
        blockedStreams: arrayUnion(blockData),
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(userBlocksRef, {
        userId,
        blockedStreams: [blockData],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // 2. Increment censorship count on stream
    const streamRef = doc(db, "streams", streamId);
    await updateDoc(streamRef, {
      censorshipCount: increment(1),
      lastCensorshipAt: serverTimestamp(),
    });

    // 3. Check if stream should be auto-hidden
    const streamDoc = await getDoc(streamRef);
    if (streamDoc.exists()) {
      const streamData = streamDoc.data();
      const censorshipCount = streamData.censorshipCount || 0;

      // If threshold exceeded, mark stream as censored
      if (censorshipCount >= CENSORSHIP_THRESHOLD && !streamData.isCensored) {
        await updateDoc(streamRef, {
          isCensored: true,
          censoredAt: serverTimestamp(),
        });
        console.log(`Stream ${streamId} has been auto-censored due to ${censorshipCount} blocks`);
      }
    }

    return {
      success: true,
      message: "Stream blocked successfully",
    };
  } catch (error) {
    console.error("Error blocking stream:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to block stream",
    };
  }
};

/**
 * Get list of blocked streams for a user
 */
export const getUserBlockedStreams = async (userId: string): Promise<string[]> => {
  try {
    const userBlocksRef = doc(db, "userBlocks", userId);
    const userBlocksDoc = await getDoc(userBlocksRef);

    if (userBlocksDoc.exists()) {
      const data = userBlocksDoc.data();
      const blockedStreams = data.blockedStreams || [];
      return blockedStreams.map((block: BlockedStream) => block.streamId);
    }

    return [];
  } catch (error) {
    console.error("Error fetching blocked streams:", error);
    return [];
  }
};

/**
 * Check if a stream is censored (blocked by multiple users)
 */
export const isStreamCensored = async (streamId: string): Promise<boolean> => {
  try {
    const streamRef = doc(db, "streams", streamId);
    const streamDoc = await getDoc(streamRef);

    if (streamDoc.exists()) {
      const streamData = streamDoc.data();
      return streamData.isCensored === true;
    }

    return false;
  } catch (error) {
    console.error("Error checking stream censorship:", error);
    return false;
  }
};

/**
 * Unblock a stream for a user
 */
export const unblockStream = async (streamId: string, userId: string) => {
  try {
    const userBlocksRef = doc(db, "userBlocks", userId);
    const userBlocksDoc = await getDoc(userBlocksRef);

    if (userBlocksDoc.exists()) {
      const data = userBlocksDoc.data();
      const blockedStreams = data.blockedStreams || [];
      
      // Remove the blocked stream
      const updatedBlocks = blockedStreams.filter(
        (block: BlockedStream) => block.streamId !== streamId
      );

      await updateDoc(userBlocksRef, {
        blockedStreams: updatedBlocks,
        updatedAt: serverTimestamp(),
      });

      // Decrement censorship count
      const streamRef = doc(db, "streams", streamId);
      await updateDoc(streamRef, {
        censorshipCount: increment(-1),
      });
    }

    return {
      success: true,
      message: "Stream unblocked successfully",
    };
  } catch (error) {
    console.error("Error unblocking stream:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to unblock stream",
    };
  }
};
