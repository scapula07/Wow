import { Button } from "./ui/button";
import { CircleX, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import type { StreamData } from "@/modules/stream/types/stream.types";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { formatRelativeTime } from "@/lib/utils/date";

interface UserData {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
}

type Props = {
  video?: boolean;
  stream?: StreamData;
};

const LivestreamCard = ({ video, stream }: Props) => {
  const navigate = useNavigate();
  const [creator, setCreator] = useState<UserData | null>(null);
  const [loadingCreator, setLoadingCreator] = useState(false);

  // Fetch creator data when stream changes
  useEffect(() => {
    const fetchCreator = async () => {
      if (!stream?.creatorId) return;
      
      setLoadingCreator(true);
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
      } finally {
        setLoadingCreator(false);
      }
    };

    fetchCreator();
  }, [stream?.creatorId]);

  const handleCardClick = () => {
    if (stream?.id) {
      navigate(`/streams/${stream.id}`);
    }
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    if (creator?.id) {
      navigate(`/user/${creator.id}/profile`);
    }
  };

  // Format viewer count for display
  const formatViewerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div 
      className="flex flex-col space-y-5 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={handleCardClick}
    >
      <div className="w-full h-[195px] relative">
        <img
          src={stream?.streamThumbnail || "/assets/images/wow-live-sample.jpg"}
          alt={stream?.streamName || "live stream"}
          className="w-full h-full rounded-[10.35px] object-cover"
        />
        {!video && (
          <span className="bg-[#141414B2] px-1.5 rounded-[2px] flex items-center font-semibold text-xs absolute bottom-5 right-3">
            <span className="text-[#FF0000] text-lg mr-1.5">●</span> 
            {stream ? formatViewerCount(stream.viewerCount) : "0"}
          </span>
        )}
        
        {/* Live indicator */}
        {stream?.isLive && (
          <span className="bg-red-600 px-2 py-1 rounded text-xs font-bold absolute top-3 left-3">
            LIVE
          </span>
        )}
        
        {/* Category badge */}
        {stream?.category && (
          <span className="bg-black/60 px-2 py-1 rounded text-xs absolute top-3 right-3">
            {stream.category}
          </span>
        )}
      </div>

      <div className="flex justify-between w-full">
        <div className="flex space-x-3.5">
          <img
            src={
              creator?.photoURL || 
              `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 6) + 1}`
            }
            alt="streamer avatar"
            className="w-[40px] h-[40px] rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleUserClick}
          />
          <div className="flex flex-col space-y-1">
            <p 
              className="font-medium cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleUserClick}
            >
              {loadingCreator 
                ? "Loading..." 
                : creator?.displayName || creator?.email?.split('@')[0] || "Unknown Creator"
              }
            </p>
            <p className="text-[#979797] font-semibold text-sm">
              {stream?.streamName ? 
                `${stream.streamName.substring(0, 50)}${stream.streamName.length > 50 ? '...' : ''}` :
                "No description available..."
              }
            </p>
            {stream?.createdAt && (
              <p className="text-[#979797] text-xs">
                Created: {formatRelativeTime(stream.createdAt)}
              </p>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-inherit w-fit p-0 h-fit hover:text-white"
              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking menu
            >
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-fit bg-[#3A3A3A] text-[#D3D3D3] border-0 py-2"
            align="start"
          >
            <DropdownMenuItem className="hover:!bg-gray-500 text-[11px] hover:!text-[#FAFAFA] cursor-pointer py-2 !flex !items-center">
              <img
                src="/assets/icons/not-interested-icon.svg"
                alt="uninterested"
                className="w-4"
              />
              Not Interested
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:!bg-gray-500 text-[11px] hover:!text-[#FAFAFA] cursor-pointer py-2 !flex !items-center">
              <CircleX className="!text-[#FAFAFA]" />
              Block Stream
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default LivestreamCard;
