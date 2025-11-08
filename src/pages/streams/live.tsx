import StreamChat from "@/modules/stream/components/stream-chat";
import StreamUserDetails from "@/modules/stream/components/stream-user-details";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import type { StreamData } from "@/modules/stream/types/stream.types";
import { BroadcastWithControls } from "@/components/broadcast-controls";

const LiveStream = () => {
  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  console.log(id);

  // Fetch stream data from Firestore
  useEffect(() => {
    const fetchStreamData = async () => {
      if (!id) {
        setError("Stream ID not provided");
        setLoading(false);
        return;
      }

      try {
        const streamDoc = await getDoc(doc(db, "streams", id));

        if (streamDoc.exists()) {
          setStreamData(streamDoc.data() as StreamData);
        } else {
          setError("Stream not found");
        }
      } catch (err) {
        console.error("Error fetching stream:", err);
        setError("Failed to load stream data");
      } finally {
        setLoading(false);
      }
    };

    fetchStreamData();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Loading stream...</div>
      </div>
    );
  }

  // Error state
  if (error || !streamData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-400 text-lg">{error || "Stream not found"}</div>
        <Button onClick={() => navigate("/")} className="text-white">
          <MoveLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex space-x-6 px-4 py-5">
      <div className="flex flex-col space-y-12 w-full md:w-2/3">
        <div className="flex flex-col space-y-1">
          <div className="w-full h-[400px] rounded-[10px] overflow-hidden">
            <BroadcastWithControls streamKey={streamData.streamKey} />
          </div>
        </div>
        <StreamUserDetails streamData={streamData} />
      </div>

      <div className="w-1/3">
        <StreamChat streamId={streamData.id} />
      </div>
    </div>
  );
};

export default LiveStream;
