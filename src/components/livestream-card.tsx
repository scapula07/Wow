import { Button } from "./ui/button";
import { CircleX, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import type { StreamData } from "@/modules/stream/types/stream.types";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { formatRelativeTime } from "@/lib/utils/date";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "sonner";
import { DeleteModal } from "./ui/delete-modal";
import { livepeerClient } from "@/lib/livepeer";
import { viewershipCache } from "@/lib/cache/viewership-cache";

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
  const location = useLocation();
  const { user } = useAuth();
  const [creator, setCreator] = useState<UserData | null>(null);
  const [loadingCreator, setLoadingCreator] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [viewership, setViewership] = useState<number | null>(null);
  const [loadingViewership, setLoadingViewership] = useState(false);

  // Check if current user owns this stream
  const isOwner = user?.id === stream?.creatorId;
  
  // Check if we're on a profile page
  const isOnProfilePage = location.pathname.includes('/profile');

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

  // Fetch viewership data from Livepeer (only for non-live streams)
  useEffect(() => {
    const fetchViewership = async () => {
      // Only fetch viewership for recorded/offline streams
      if (!stream?.playbackId || stream?.isLive) {
        setLoadingViewership(false);
        return;
      }
      
      // Check cache first
      const cachedViews = viewershipCache.get(stream.playbackId);
      if (cachedViews !== null) {
        console.log(`📦 Using cached viewership for ${stream.playbackId}:`, cachedViews);
        setViewership(cachedViews);
        setLoadingViewership(false);
        return;
      }
      
      // Fetch from Livepeer API
      setLoadingViewership(true);
      try {
        const { success, data } = await livepeerClient.getViewership(stream.playbackId);
        if (success && data) {
          // Livepeer returns total views - extract the viewCount
          const totalViews = data[0]?.viewCount || data.viewCount || 0;
          setViewership(totalViews);
          
          // Cache the result
          viewershipCache.set(stream.playbackId, totalViews);
          console.log(`💾 Cached viewership for ${stream.playbackId}:`, totalViews);
        }
      } catch (error) {
        console.error("Error fetching viewership:", error);
      } finally {
        setLoadingViewership(false);
      }
    };

    fetchViewership();
  }, [stream?.playbackId, stream?.isLive]);

  const handleCardClick = () => {
    if (stream?.id) {
      // If user owns this stream AND we're on a profile page, navigate to create page
      if (isOwner && isOnProfilePage) {
        navigate(`/streams/${stream.id}/create`);
      } else {
        // Otherwise, navigate to viewer page
        navigate(`/streams/${stream.id}`);
      }
    }
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    if (creator?.id) {
      navigate(`/user/${creator.id}/profile`);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!stream?.id) return;

    setDeleting(true);
    try {
      // Delete stream document from Firestore
      await deleteDoc(doc(db, "streams", stream.id));
      
      toast.success("Stream deleted successfully");
      setShowDeleteModal(false);
      
      // Optionally refresh the page or remove the card from view
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error deleting stream:", error);
      toast.error("Failed to delete stream");
    } finally {
      setDeleting(false);
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
            {loadingViewership 
              ? "..." 
              : formatViewerCount(viewership !== null ? viewership : (stream?.viewerCount || 0))
            }
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
                {formatRelativeTime(stream.createdAt)}
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
            
            {/* Only show delete option if user owns stream AND we're on profile page */}
            {isOwner && isOnProfilePage ? (
              <DropdownMenuItem 
                className="hover:!bg-gray-500 text-[11px] hover:!text-[#FAFAFA] cursor-pointer py-2 !flex !items-center text-red-400 hover:!text-red-300"
                onClick={handleDeleteClick}
              >
                <Trash2 className="!text-red-400 w-4 h-4" />
                Delete Stream
              </DropdownMenuItem>
            ) : !isOwner ? (
              <DropdownMenuItem className="hover:!bg-gray-500 text-[11px] hover:!text-[#FAFAFA] cursor-pointer py-2 !flex !items-center">
                <CircleX className="!text-[#FAFAFA]" />
                Block Stream
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Stream"
        itemName={stream?.streamName}
        isDeleting={deleting}
      />
    </div>
  );
};

export default LivestreamCard;
