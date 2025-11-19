import LivestreamCard from "@/components/livestream-card";
import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useParams } from "react-router-dom";
import type { StreamData } from "@/modules/stream/types/stream.types";

const ProfileLivestreamTab = () => {
  const [streams, setStreams] = useState<StreamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchUserStreams = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const streamsQuery = query(
          collection(db, "streams"),
          where("creatorId", "==", id),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(streamsQuery);
        const userStreams = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as StreamData[];

        setStreams(userStreams);
      } catch (err) {
        console.error("Error fetching user streams:", err);
        setError("Failed to load streams");
      } finally {
        setLoading(false);
      }
    };

    fetchUserStreams();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white text-lg">Loading streams...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-red-400 text-lg">{error}</div>
      </div>
    );
  }

  if (streams.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400 text-lg">No streams found</div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-4 grid-cols-1 gap-x-5 gap-y-8 mb-6">
      {streams.map((stream) => (
        <LivestreamCard key={stream.id} stream={stream} />
      ))}
    </div>
  );
};

export default ProfileLivestreamTab;
