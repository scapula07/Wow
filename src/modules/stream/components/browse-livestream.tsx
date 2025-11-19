import { Input } from "@/components/ui/input";
import { BrowseRecommendedDropdown } from "./browse-recommended-dropdown";
import { SearchIcon, X } from "lucide-react";
import LivestreamCard from "@/components/livestream-card";
import { useState, useEffect } from "react";
import { collection, query, limit, getDocs, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import type { StreamData } from "@/modules/stream/types/stream.types";
import { getCategoryById } from "@/lib/constants/livestream-categories";
import { useNavigate } from "react-router-dom";

type Props = {
  following?: boolean;
  categoryFilter?: string | null;
};

const BrowseLivestreams = ({ following, categoryFilter }: Props) => {
  const [streams, setStreams] = useState<StreamData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Use getDocs instead of onSnapshot to avoid conflicts with carousel's onSnapshot
    const fetchStreams = async () => {
      try {
        let q;
        
        if (categoryFilter) {
          // Filter by category if provided
          q = query(
            collection(db, "streams"),
            where("category", "==", categoryFilter),
            limit(50)
          );
        } else {
          // Fetch all streams
          q = query(
            collection(db, "streams"),
            limit(50)
          );
        }

        const snapshot = await getDocs(q);
        const streamData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as StreamData[];

        // Sort on the client side by createdAt descending
        const sortedStreams = streamData.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        setStreams(sortedStreams);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching streams:", error);
        setLoading(false);
      }
    };

    fetchStreams();
  }, [categoryFilter]);

  const handleClearFilter = () => {
    navigate("/browse");
  };

  const categoryData = categoryFilter ? getCategoryById(categoryFilter) : null;

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

      {/* Category filter badge */}
      {categoryFilter && categoryData && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-gray-400">Filtering by:</span>
          <div className="flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2">
            <span className="text-sm font-medium text-primary">{categoryData.name}</span>
            <button
              onClick={handleClearFilter}
              className="hover:bg-primary/20 rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4 text-primary" />
            </button>
          </div>
          <span className="text-sm text-gray-400">
            ({streams.length} stream{streams.length !== 1 ? 's' : ''} found)
          </span>
        </div>
      )}

      <div className="grid md:grid-cols-4 grid-cols-1 gap-x-5 gap-y-8">
        {loading ? (
          // Show loading skeletons
          [...Array(8)].map((_, i) => (
            <LivestreamCard key={i} />
          ))
        ) : streams.length > 0 ? (
          // Show actual stream data
          streams.map((stream) => (
            <LivestreamCard key={stream.id} stream={stream} />
          ))
        ) : (
          // Show empty state when no streams found
          <div className="col-span-4 text-center py-20">
            <p className="text-gray-400 text-lg">
              {categoryFilter 
                ? `No streams found in "${categoryData?.name}" category` 
                : "No streams available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseLivestreams;
