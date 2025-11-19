import { cn } from "@/lib/utils";
import { HStack } from "./ui/stack";
import { useState, useEffect } from "react";
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useNavigate } from "react-router-dom";

interface RecommendedChannel {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  liveStreams?: number;
  totalViewers?: number;
}

type Props = {
  expanded: boolean;
};

const ChannelLists = ({ expanded }: Props) => {
  const navigate = useNavigate();
  const [recommendedChannel, setRecommendedChannel] = useState<RecommendedChannel | null>(null);
  const [loading, setLoading] = useState(true);
  
  const ADMIN_USER_ID = import.meta.env.VITE_ADMIN_USER_ID;

  useEffect(() => {
    const fetchRecommendedChannel = async () => {
      console.log("🔍 Admin User ID:", ADMIN_USER_ID);
      
      if (!ADMIN_USER_ID) {
        console.warn("No admin user ID configured");
        setLoading(false);
        return;
      }

      try {
        console.log("📡 Fetching admin user profile...");
        // Fetch admin user profile
        const userDoc = await getDoc(doc(db, "users", ADMIN_USER_ID));
        
        console.log("👤 User doc exists:", userDoc.exists());
        
        if (!userDoc.exists()) {
          console.warn("Admin user not found");
          setLoading(false);
          return;
        }

        const userData = userDoc.data();
        console.log("✅ User data:", userData);
        
        // Fetch admin's active streams to get viewer count
        const streamsQuery = query(
          collection(db, "streams"),
          where("creatorId", "==", ADMIN_USER_ID),
          where("isLive", "==", true),
          orderBy("createdAt", "desc"),
          limit(10)
        );

        const streamsSnapshot = await getDocs(streamsQuery);
        console.log("🎥 Live streams found:", streamsSnapshot.size);
        
        // Calculate total viewers from all live streams
        let totalViewers = 0;
        streamsSnapshot.docs.forEach(doc => {
          const streamData = doc.data();
          totalViewers += streamData.viewerCount || 0;
        });

        const channelData = {
          id: userDoc.id,
          displayName: userData.displayName || userData.email?.split('@')[0] || "Admin",
          email: userData.email,
          photoURL: userData.photoURL,
          liveStreams: streamsSnapshot.size,
          totalViewers: totalViewers
        };
        
        console.log("🎯 Setting recommended channel:", channelData);
        setRecommendedChannel(channelData);
      } catch (error) {
        console.error("❌ Error fetching recommended channel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedChannel();
  }, [ADMIN_USER_ID]);

  const handleChannelClick = () => {
    if (recommendedChannel?.id) {
      navigate(`/user/${recommendedChannel.id}/profile`);
    }
  };

  if (loading) {
    console.log("⏳ Channel list is loading...");
    return (
      <div className="pt-6 flex-col !items-start">
        {expanded && (
          <h3 className={cn("text-sm font-semibold mb-2 text-white whitespace-nowrap")}>
            Recommended Channels
          </h3>
        )}
        <div className="flex flex-col mt-6 space-y-6 w-full">
          <div className="text-gray-400 text-xs ml-1">Loading...</div>
        </div>
      </div>
    );
  }

  if (!recommendedChannel) {
    console.log("❌ No recommended channel data");
    return (
      <div className="pt-6 flex-col !items-start">
        {expanded && (
          <h3 className={cn("text-sm font-semibold mb-2 text-white whitespace-nowrap")}>
            Recommended Channels
          </h3>
        )}
        <div className="flex flex-col mt-6 space-y-6 w-full">
          <div className="text-gray-400 text-xs ml-1">No channels available</div>
        </div>
      </div>
    );
  }
  
  console.log("✨ Rendering recommended channel:", recommendedChannel);
  return (
    <div className="pt-6 flex-col !items-start">
      {expanded && (
        <h3
          className={cn(
            "text-sm font-semibold mb-2 transition-colors duration-300 text-white whitespace-nowrap"
          )}
        >
          Recommended Channels
        </h3>
      )}

      <div className="flex flex-col mt-6 space-y-6 w-full">
        <div
          className="!w-full flex items-center justify-between space-x-3 whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleChannelClick}
        >
          <HStack className="items-center space-x-2">
            <img
              src={recommendedChannel.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(recommendedChannel.displayName)}&background=random`}
              alt={recommendedChannel.displayName}
              className="w-7 h-7 rounded-full ml-1 object-cover"
            />
            <span
              className={cn(
                "text-xs font-medium flex-1 flex items-center justify-between transform transition-all duration-300",
                expanded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-5 pointer-events-none"
              )}
            >
              {recommendedChannel.displayName}
            </span>
          </HStack>
          
          {recommendedChannel.liveStreams && recommendedChannel.liveStreams > 0 ? (
            <span
              className={cn(
                "text-white text-xs font-semibold",
                expanded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-5 pointer-events-none"
              )}
            >
              <span className="text-[#FF0000] text-xl mr-0.5">●</span>{" "}
              {recommendedChannel.totalViewers && recommendedChannel.totalViewers >= 1000
                ? `${(recommendedChannel.totalViewers / 1000).toFixed(1)}K`
                : recommendedChannel.totalViewers || 0}
            </span>
          ) : (
            <span
              className={cn(
                "text-gray-500 text-xs",
                expanded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-5 pointer-events-none"
              )}
            >
              Offline
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelLists;
