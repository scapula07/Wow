import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

interface ChannelData {
  id: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  followerCount?: number;
  isLive?: boolean;
}

type Props = {
  channelId?: string;
  channel?: ChannelData;
};

const ChannelCard = ({ channelId, channel }: Props) => {
  const [channelData, setChannelData] = useState<ChannelData | null>(channel || null);
  const [loading, setLoading] = useState(!channel);
  const navigate = useNavigate();

  // Generate random background gradients similar to the image
  const backgroundGradients = [
    "bg-gradient-to-br from-purple-400 via-pink-300 to-green-300",
    "bg-gradient-to-br from-blue-400 via-purple-300 to-pink-300", 
    "bg-gradient-to-br from-green-400 via-yellow-300 to-orange-300",
    "bg-gradient-to-br from-indigo-400 via-blue-300 to-cyan-300",
    "bg-gradient-to-br from-pink-400 via-red-300 to-yellow-300",
    "bg-gradient-to-br from-teal-400 via-green-300 to-blue-300"
  ];

  // Get random gradient
  const randomGradient = backgroundGradients[Math.floor(Math.random() * backgroundGradients.length)];

  // Fetch channel data if only ID is provided
  useEffect(() => {
    if (channelId && !channel) {
      const fetchChannel = async () => {
        try {
          const channelDoc = await getDoc(doc(db, "users", channelId));
          if (channelDoc.exists()) {
            setChannelData({
              id: channelDoc.id,
              ...channelDoc.data()
            } as ChannelData);
          }
        } catch (error) {
          console.error("Error fetching channel:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchChannel();
    }
  }, [channelId, channel]);

  // Get display name with fallback logic
  const getDisplayName = () => {
    if (!channelData) return "Unknown Channel";
    if (channelData.displayName) return channelData.displayName;
    if (channelData.firstName && channelData.lastName) return `${channelData.firstName} ${channelData.lastName}`;
    if (channelData.firstName) return channelData.firstName;
    if (channelData.email) return channelData.email.split('@')[0];
    return "Unknown Channel";
  };

  const handleClick = () => {
    if (channelData?.id) {
      navigate(`/user/${channelData.id}/profile`);
    }
  };

  if (loading) {
    return (
      <div className="relative rounded-2xl overflow-hidden cursor-pointer group h-48 bg-gray-600 animate-pulse">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-gray-400 rounded-full mb-3"></div>
          <div className="w-20 h-4 bg-gray-400 rounded"></div>
        </div>
      </div>
    );
  }

  if (!channelData) {
    return null;
  }

  return (
    <div 
      className={`relative rounded-2xl overflow-hidden cursor-pointer group h-48 ${randomGradient} hover:scale-105 transition-transform duration-300`}
      onClick={handleClick}
    >
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Live indicator */}
      {channelData.isLive && (
        <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
          LIVE
        </div>
      )}

      {/* Channel Info */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
        {/* Profile Picture */}
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 overflow-hidden">
            {channelData.photoURL ? (
              <img
                src={channelData.photoURL}
                alt={getDisplayName()}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                {getDisplayName().charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          {/* Follower count badge */}
          {channelData.followerCount !== undefined && channelData.followerCount > 0 && (
            <div className="absolute -bottom-1 -right-1 bg-black/70 text-white px-2 py-0.5 rounded-full text-xs">
              {channelData.followerCount >= 1000 
                ? `${(channelData.followerCount / 1000).toFixed(1)}k`
                : channelData.followerCount
              }
            </div>
          )}
        </div>

        {/* Channel Name */}
        <h3 className="text-white font-semibold text-center text-lg drop-shadow-lg">
          {getDisplayName()}
        </h3>
        
        {/* Optional subtitle */}
        {channelData.followerCount !== undefined && (
          <p className="text-white/80 text-sm mt-1">
            {channelData.followerCount} followers
          </p>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
    </div>
  );
};

export default ChannelCard;
