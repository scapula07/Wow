import { Input } from "@/components/ui/input";
import { BrowseRecommendedDropdown } from "./browse-recommended-dropdown";
import { SearchIcon } from "lucide-react";
import ChannelCard from "@/components/channel-card";
import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
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
  following?: boolean;
};

const BrowseChannels = ({ following }: Props) => {
  const [channels, setChannels] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        // Fetch users/channels from Firestore
        const channelsQuery = query(
          collection(db, "users"),
          orderBy("followerCount", "desc"),
          limit(12)
        );

        const querySnapshot = await getDocs(channelsQuery);
        const channelData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ChannelData[];

        setChannels(channelData);
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  return (
    <div>
      {!following && (
        <div className="flex items-center justify-between space-x-10 mb-8">
          <div className="bg-[#141414] w-full !h-12 relative">
            <Input
              placeholder="Search livestreams"
              className="pl-11 border-none !bg-inherit !text-white !h-full !w-full"
            />
            <SearchIcon className="text-[#5B5B5B] absolute left-2 top-1/2 -translate-y-1/2 placeholder:text-[#9F9F9F]" />
          </div>
          <BrowseRecommendedDropdown />
        </div>
      )}

      <div className="grid md:grid-cols-4 grid-cols-1 gap-x-5 gap-y-8">
        {loading ? (
          // Show loading skeletons
          [...Array(8)].map((_, i) => (
            <ChannelCard key={i} />
          ))
        ) : (
          // Show actual channel data
          channels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))
        )}
      </div>
    </div>
  );
};

export default BrowseChannels;
