import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router";
import type { StreamData } from "@/modules/stream/types/stream.types";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { livepeerClient } from "@/lib/livepeer";
import { viewershipCache } from "@/lib/cache/viewership-cache";

type Props = {
  img: string;
  stream?: StreamData;
};

interface UserData {
  id: string;
  displayName?: string;
  photoURL?: string;
  email: string;
  followerCount?: number;
}

const CarouselItem = ({ img, stream }: Props) => {
  const [creator, setCreator] = useState<UserData | null>(null);
  const [viewership, setViewership] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreator = async () => {
      if (!stream?.creatorId) return;

      try {
        const userDoc = await getDoc(doc(db, "users", stream.creatorId));
        if (userDoc.exists()) {
          setCreator({
            id: userDoc.id,
            ...userDoc.data()
          } as UserData);
        }
      } catch (error) {
        console.error("Error fetching creator:", error);
      }
    };

    fetchCreator();
  }, [stream?.creatorId]);

  // Fetch viewership data from Livepeer
  useEffect(() => {
    const fetchViewership = async () => {
      if (!stream?.playbackId) {
        setViewership(0);
        return;
      }

      // For live streams, always fetch fresh data
      if (stream.isLive) {
        try {
          const { success, data } = await livepeerClient.getViewership(stream.playbackId);
          if (success && data) {
            const totalViews = data[0]?.viewCount || data.viewCount || 0;
            setViewership(totalViews);
            viewershipCache.set(stream.playbackId, totalViews);
            console.log(`📺 Carousel viewership for ${stream.playbackId}:`, totalViews);
          }
        } catch (error) {
          console.error("Error fetching viewership:", error);
        }
        return;
      }
      
      // For offline streams, check cache first
      const cachedViews = viewershipCache.get(stream.playbackId);
      if (cachedViews !== null) {
        setViewership(cachedViews);
        return;
      }
      
      // Fetch from Livepeer API
      try {
        const { success, data } = await livepeerClient.getViewership(stream.playbackId);
        if (success && data) {
          const totalViews = data[0]?.viewCount || data.viewCount || 0;
          setViewership(totalViews);
          viewershipCache.set(stream.playbackId, totalViews);
        }
      } catch (error) {
        console.error("Error fetching viewership:", error);
      }
    };

    fetchViewership();

    // For live streams, refresh viewership every 15 seconds
    let interval: NodeJS.Timeout | null = null;
    if (stream?.isLive && stream?.playbackId) {
      interval = setInterval(fetchViewership, 15000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stream?.playbackId, stream?.isLive]);

  const formatCount = (count?: number) => {
    if (!count) return "0";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (stream?.id) {
      navigate(`/streams/${stream.id}/live`);
    }
  };

  console.log(stream,creator,"creator in carousel item");

  return (
    <div
      onClick={handleClick}
      className="relative w-full min-w-full flex flex-col justify-end rounded-[20px] cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
      style={{
        height: "360px",
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >

      {stream?.isLive && (
        <div className="absolute top-4 left-4 ">
          <h2 className="text-white font-semibold text-sm bg-red-600 px-2 py-1 rounded-md">
            Live
          </h2>
        </div>
      )}
  

      <div className="w-full flex items-center justify-between bg-[#070707B2] p-4">
        <Link 
          to={stream ? `/user/${stream.creatorId}/profile` : "#"}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center space-x-3">
            <img
              src={creator?.photoURL || `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 6) + 1}`}
              alt="creator avatar"
              className="w-[53px] h-[53px] rounded-full object-cover"
            />
            <div>
              <h3 className="text-[#FFFFFFE5] font-medium">
                   {stream?.streamName}
              </h3>
              <p className="text-[#D3CDCDE5] text-[13px] font-medium">
                   {creator?.displayName || creator?.email?.split('@')[0] || "Loading..."}
              </p>
            </div>
          </div>
        </Link>

        <span className={cn("text-white text-xs font-semibold")}>
          <span className="text-[#FF0000] text-xl mr-0.5">●</span>{" "}
          {formatCount(viewership)}
        </span>
      </div>
    </div>
  );
};

export default CarouselItem;
