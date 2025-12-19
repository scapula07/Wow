import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import CarouselItem from "./carousel-item";
import { collection, query, where, limit, onSnapshot, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import type { StreamData } from "@/modules/stream/types/stream.types";
import { useNavigate } from "react-router-dom";

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [streams, setStreams] = useState<StreamData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch live streams first, fallback to most recent if no live streams
  useEffect(() => {
    const q = query(
      collection(db, "streams"),
      where("isLive", "==", true),
      limit(10) // Fetch more and sort on client side
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const liveStreams = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as StreamData[];

        if (liveStreams.length > 0) {
          // Sort by viewerCount on client side and take top 3
          // const sortedStreams = liveStreams
          //   .sort((a, b) => (b.viewerCount || 0) - (a.viewerCount || 0))
          //   .slice(0, 3);
          
          // For now, just take the first 3 without sorting
          const sortedStreams = liveStreams.slice(0, 3);

          console.log("📺 Live streams for carousel:", sortedStreams);
          setStreams(sortedStreams);
          setLoading(false);
        } else {
          // No live streams, fetch most recent streams
          console.log("📺 No live streams, fetching most recent...");
          try {
            const recentQuery = query(
              collection(db, "streams"),
              orderBy("createdAt", "desc"),
              limit(3)
            );
            const recentSnapshot = await getDocs(recentQuery);
            const recentStreams = recentSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as StreamData[];

            console.log("📺 Most recent streams for carousel:", recentStreams);
            setStreams(recentStreams);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching recent streams:", error);
            setStreams([]);
            setLoading(false);
          }
        }
      },
      (error) => {
        console.error("Error fetching live streams:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const prev = () => {
    const length = 3; // Always 3 slots
    setActiveIndex((i) => (i === 0 ? length - 1 : i - 1));
  };

  const next = () => {
    const length = 3; // Always 3 slots
    setActiveIndex((i) => (i === length - 1 ? 0 : i + 1));
  };

  const handlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // Show loading state
  if (loading) {
    return (
      <div className="relative flex items-center justify-center h-[500px] overflow-hidden -mx-5">
        <div className="text-white text-lg">Loading top streams...</div>
      </div>
    );
  }

  // Always show 3 items - fill remaining slots with skeleton cards
  const TOTAL_SLOTS = 3;
  const displayItems: (StreamData | null)[] = [
    ...streams,
    ...Array(Math.max(0, TOTAL_SLOTS - streams.length)).fill(null)
  ];

  return (
    <div
      {...handlers}
      className="relative flex items-center justify-center h-[500px] overflow-hidden -mx-5"
    >
      {displayItems.map((stream, index) => {
        const isSkeletonCard = stream === null;
        const length = TOTAL_SLOTS;
        const position = (index - activeIndex + length) % length;

        let style =
          "opacity-0 scale-75 translate-x-0 z-0 transition-all duration-500 ease-in-out";
        if (position === 0) {
          style = "opacity-100 scale-100 translate-x-0 z-20";
        } else if (position === 1) {
          style =
            "opacity-30 scale-80 translate-x-1/2 sm:translate-x-2/3 z-10 blur-[1px]";
        } else if (position === length - 1) {
          style =
            "opacity-30 scale-80 -translate-x-1/2 sm:-translate-x-2/3 z-10 blur-[1px]";
        }

        return (
          <div
            key={isSkeletonCard ? `skeleton-${index}` : stream.id}
            className={cn(
              "absolute md:top-6 top-5 w-[90%] sm:w-[70%] md:w-[80%] lg:w-[45%]",
              "transition-all duration-500 ease-in-out",
              style
            )}
            onClick={() => {
              if (!isSkeletonCard && stream.id) {
                navigate(`/streams/${stream.id}`);
              }
            }}
          >
            {isSkeletonCard ? (
              <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg overflow-hidden h-[360px] animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/20 to-transparent shimmer" />
                <div className="p-4 h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-700/50 rounded w-2/3" />
                    <div className="h-4 bg-gray-700/50 rounded w-1/2" />
                  </div>
                  <div className="w-full bg-[#070707B2] rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-[53px] h-[53px] rounded-full bg-gray-700/50" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-700/50 rounded w-2/3" />
                        <div className="h-3 bg-gray-700/50 rounded w-1/3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="cursor-pointer hover:scale-105 transition-transform">
                <CarouselItem 
                  img={stream.streamThumbnail || "/assets/images/wow-live-sample.jpg"}
                  stream={stream}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Navigation buttons (hide on very small screens) */}
      <Button
        size="icon"
        onClick={prev}
        className="absolute z-20 hidden lg:flex left-4 top-48 text-white hover:bg-[#1f8b3a] transition md:w-10 md:h-10 w-8 h-8"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <Button
        size="icon"
        onClick={next}
        className="absolute z-20 hidden lg:flex right-4 top-48 text-white hover:bg-[#1f8b3a] transition md:w-10 md:h-10 w-8 h-8"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Carousel;
