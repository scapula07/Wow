import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { StreamData } from "@/modules/stream/types/stream.types";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { formatRelativeTime } from "@/lib/utils/date";
import { livepeerClient } from "@/lib/livepeer";
import { viewershipCache } from "@/lib/cache/viewership-cache";

interface UserData {
  id: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
}

interface StreamUserDetailsProps {
  streamData: StreamData;
}

const StreamUserDetails = ({ streamData }: StreamUserDetailsProps) => {
  const [creator, setCreator] = useState<UserData | null>(null);
  const [loadingCreator, setLoadingCreator] = useState(false);
  const [viewership, setViewership] = useState<number>(0);

  // Fetch creator data when streamData changes
  useEffect(() => {
    const fetchCreator = async () => {
      if (!streamData?.creatorId) return;
      
      setLoadingCreator(true);
      try {
        const userDoc = await getDoc(doc(db, "users", streamData.creatorId));
        if (userDoc.exists()) {
          setCreator({
            id: userDoc.id,
            ...userDoc.data()
          } as UserData);
        }
      } catch (error) {
        console.error("Error fetching creator:", error);
      } finally {
        setLoadingCreator(false);
      }
    };

    fetchCreator();
  }, [streamData?.creatorId]);

  // Fetch viewership data from Livepeer
  useEffect(() => {
    const fetchViewership = async () => {
      if (!streamData?.playbackId) {
        setViewership(0);
        return;
      }

      // For live streams, always fetch fresh data (no cache)
      if (streamData.isLive) {
        try {
          const { success, data } = await livepeerClient.getViewership(streamData.playbackId);
          if (success && data) {
            const totalViews = data[0]?.viewCount || data.viewCount || 0;
            setViewership(totalViews);
            console.log(`📺 Real-time viewership for ${streamData.playbackId}:`, totalViews);
          }
        } catch (error) {
          console.error("Error fetching viewership:", error);
        }
        return;
      }
      
      // For offline streams, check cache first
      const cachedViews = viewershipCache.get(streamData.playbackId);
      if (cachedViews !== null) {
        console.log(`📦 Using cached viewership for ${streamData.playbackId}:`, cachedViews);
        setViewership(cachedViews);
        return;
      }
      
      // Fetch from Livepeer API
      try {
        const { success, data } = await livepeerClient.getViewership(streamData.playbackId);
        if (success && data) {
          const totalViews = data[0]?.viewCount || data.viewCount || 0;
          setViewership(totalViews);
          viewershipCache.set(streamData.playbackId, totalViews);
          console.log(`💾 Cached viewership for ${streamData.playbackId}:`, totalViews);
        }
      } catch (error) {
        console.error("Error fetching viewership:", error);
      }
    };

    fetchViewership();

    // For live streams, refresh viewership every 10 seconds for real-time updates
    let interval: NodeJS.Timeout | null = null;
    if (streamData?.isLive && streamData?.playbackId) {
      interval = setInterval(fetchViewership, 10000); // 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [streamData?.playbackId, streamData?.isLive]);

  return (
    <div className="flex flex-col space-y-7 pb-6">
      <p className="text-xl font-semibold">
        {streamData.streamName || "Stream Title"}
      </p>

      <div className="flex w-full justify-between">
        <div className="flex space-x-5">
          <Avatar className="w-[60px] h-[60px]">
            <AvatarImage
              src={creator?.photoURL || "https://i.pravatar.cc/60?img=1"}
              className="rounded-full"
            />
            <AvatarFallback>
              {creator?.firstName?.charAt(0)?.toUpperCase() || 
               creator?.displayName?.charAt(0)?.toUpperCase() || 
               streamData.streamName?.charAt(0)?.toUpperCase() || "S"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-2xl">
              {loadingCreator ? (
                "Loading..."
              ) : (
                creator?.displayName || 
                `${creator?.firstName || ""} ${creator?.lastName || ""}`.trim() ||
                creator?.email?.split('@')[0] || 
                "Unknown Creator"
              )}
            </h3>
            <p className="text-xl font-medium">
              {viewership.toLocaleString()}{" "}
              <span className="text-[#FFFFFFB2]">viewers</span>{" "}
              {streamData.isLive && (
                <>
                  <span className="text-xs mx-1 relative bottom-0.5 text-red-500">●</span>
                  <span className="text-[#FFFFFFB2]">LIVE</span>
                </>
              )}
            </p>
            <p className="font-medium">
              Category: {streamData.category || "Uncategorized"}
            </p>
            {streamData.createdAt && (
              <p className="text-sm text-[#FFFFFFB2]">
                Created: {formatRelativeTime(streamData.createdAt)}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <a href="#" target="_blank" className="flex items-center space-x-3">
            <img
              src="/assets/icons/wow-youtube.svg"
              alt="youtube"
              className="w-[30px] h-[30px]"
            />
            <p className="text-[#FFFFFFB2] font-medium">Youtube</p>
          </a>
          <a href="#" target="_blank" className="flex items-center space-x-3">
            <img
              src="/assets/icons/wow-instagram.svg"
              alt="instagram"
              className="w-[30px] h-[30px]"
            />
            <p className="text-[#FFFFFFB2] font-medium">Instagram</p>
          </a>
          <a href="#" target="_blank" className="flex items-center space-x-3">
            <img
              src="/assets/icons/wow-tiktok.svg"
              alt="tiktok"
              className="w-[30px] h-[30px]"
            />
            <p className="text-[#FFFFFFB2] font-medium">Tiktok</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default StreamUserDetails;
