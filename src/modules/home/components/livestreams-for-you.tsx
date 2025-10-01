import LivestreamCard from "@/components/livestream-card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { collection, query, orderBy, limit, startAfter, getDocs, QueryDocumentSnapshot, type DocumentData } from "firebase/firestore";
import { db } from "@/firebase/config";
import type { StreamData } from "@/modules/stream/types/stream.types";

const STREAMS_PER_PAGE = 8;

const LivestreamsForYou = () => {
  const [streams, setStreams] = useState<StreamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Refs to track current values to avoid stale closures
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
  const loadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);

  // Update refs when state changes
  useEffect(() => {
    lastDocRef.current = lastDoc;
  }, [lastDoc]);

  useEffect(() => {
    loadingMoreRef.current = loadingMore;
  }, [loadingMore]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // Fetch initial streams
  const fetchStreams = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        if (loadingMoreRef.current || !hasMoreRef.current) return; // Prevent multiple simultaneous requests
        setLoadingMore(true);
        loadingMoreRef.current = true;
      } else {
        setLoading(true);
        setError(null);
        setHasMore(true);
        hasMoreRef.current = true;
        setLastDoc(null);
        lastDocRef.current = null;
      }

      let q = query(
        collection(db, "streams"),
        orderBy("createdAt", "desc"),
        limit(STREAMS_PER_PAGE)
      );

      // If loading more, start after the last document
      if (isLoadMore && lastDocRef.current) {
        q = query(
          collection(db, "streams"),
          orderBy("createdAt", "desc"),
          startAfter(lastDocRef.current),
          limit(STREAMS_PER_PAGE)
        );
      }

      const querySnapshot = await getDocs(q);
      const newStreams = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StreamData[];

      if (isLoadMore) {
        // Prevent duplicates by filtering out streams that already exist
        setStreams(prev => {
          const existingIds = new Set(prev.map(stream => stream.id));
          const uniqueNewStreams = newStreams.filter(stream => !existingIds.has(stream.id));
          return [...prev, ...uniqueNewStreams];
        });
      } else {
        setStreams(newStreams);
      }

      // Update pagination state
      if (querySnapshot.docs.length < STREAMS_PER_PAGE) {
        setHasMore(false);
        hasMoreRef.current = false;
      } else {
        setHasMore(true);
        hasMoreRef.current = true;
      }

      if (querySnapshot.docs.length > 0) {
        const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastDoc(newLastDoc);
        lastDocRef.current = newLastDoc;
      }

    } catch (err) {
      console.error("Error fetching streams:", err);
      setError("Failed to load streams");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      loadingMoreRef.current = false;
    }
  }, []); // Remove all dependencies to prevent recreation

  // Load more streams
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchStreams(true);
    }
  }, [fetchStreams, loadingMore, hasMore]);

  // Scroll event handler for infinite loading
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Debounce scroll events to prevent excessive calls
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (
          window.innerHeight + document.documentElement.scrollTop
          >= document.documentElement.offsetHeight - 1000 // Load when 1000px from bottom
        ) {
          loadMore();
        }
      }, 100); // 100ms debounce
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [loadMore]);

  // Initial load
  useEffect(() => {
    fetchStreams();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium">Livestreams For You </h2>
          <div className="flex items-center">
            <Button variant="link" className="hover:no-underline">
              View all
            </Button>
            <Button className="bg-[#3A3A3A] text-[#FAFAFAB2] rounded-[20px] h-10 !px-4">
              <Filter />
              Filter
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-white text-lg">Loading streams...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium">Livestreams For You </h2>
          <div className="flex items-center">
            <Button variant="link" className="hover:no-underline">
              View all
            </Button>
            <Button className="bg-[#3A3A3A] text-[#FAFAFAB2] rounded-[20px] h-10 !px-4">
              <Filter />
              Filter
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="text-red-400 text-lg">{error}</div>
          <Button onClick={() => fetchStreams()} className="text-white">
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">Livestreams For You </h2>
        <div className="flex items-center">
          <Button variant="link" className="hover:no-underline">
            View all
          </Button>
          <Button className="bg-[#3A3A3A] text-[#FAFAFAB2] rounded-[20px] h-10 !px-4">
            <Filter />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 grid-cols-1 gap-x-5 gap-y-8">
        {streams.map((stream) => (
          <LivestreamCard 
            key={stream.id} 
            stream={stream}
          />
        ))}
      </div>

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="flex items-center justify-center py-8">
          <div className="text-white text-sm">Loading more streams...</div>
        </div>
      )}

      {/* No more streams indicator */}
      {!hasMore && streams.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-400 text-sm">No more streams to load</div>
        </div>
      )}

      {/* No streams found */}
      {streams.length === 0 && !loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400 text-lg">No streams found</div>
        </div>
      )}

      {/* Manual load more button (fallback) */}
      {hasMore && !loadingMore && streams.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <Button 
            onClick={loadMore}
            variant="outline"
            className="text-white border-gray-600 hover:bg-gray-800"
          >
            Load More Streams
          </Button>
        </div>
      )}
    </div>
  );
};

export default LivestreamsForYou;
