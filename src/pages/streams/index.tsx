import StreamChat from "@/modules/stream/components/stream-chat";
import StreamUserDetails from "@/modules/stream/components/stream-user-details";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import type { StreamData } from "@/modules/stream/types/stream.types";
import { PlayerWithControls } from "@/components/player-with-controls";
import type { Src } from "@livepeer/react";
import { Toaster } from "@/components/ui/sonner";

// Helper function to create Livepeer source
const createPlayerSrc = (playbackId: string): Src[] => {
  return [
    {
      src: `https://livepeercdn.studio/hls/${playbackId}/index.m3u8`,
      width: 1920,
      height: 1080,
      mime: 'application/vnd.apple.mpegurl' as const,
      type: 'hls' as const
    }
  ];
};

const VodStream = () => {
  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerSrc, setPlayerSrc] = useState<Src[] | null>(null);

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
          const data = streamDoc.data() as StreamData;
          console.log("Stream data:", data);
          setStreamData(data);
          
          // Generate player source from playbackId
          if (data.playbackId) {
            console.log("Playback ID:", data.playbackId);
            
            // Create proper player source
            const playerSource = createPlayerSrc(data.playbackId);
            setPlayerSrc(playerSource);
            
            console.log("Generated player source:", playerSource);
          } else {
            console.log("No playback ID found in stream data");
          }
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

  console.log("Stream src:", playerSrc);
  return (
    <>
      <div className="flex space-x-6 px-4 py-5">
        <div className="flex flex-col space-y-12 w-full md:w-2/3">
          <div className="flex flex-col space-y-1">
            <div className="w-full h-[400px] rounded-[10px] overflow-hidden">
              {playerSrc ? (
                <PlayerWithControls src={playerSrc} />
              ) : (
                <div className="w-full h-full bg-black/20 flex items-center justify-center rounded-[10px]">
                  <div className="text-center">
                    <div className="text-white text-lg mb-2">Loading player...</div>
                    <div className="text-gray-400 text-sm">
                      {streamData?.playbackId ? 
                        `Playback ID: ${streamData.playbackId}` : 
                        "No playback ID available"
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between px-2 py-1 bg-[#232222] rounded-[5px]">
              <div className="text-white text-sm">
                <span className="font-medium">{streamData.streamName}</span>
              </div>
              <div className="text-gray-400 text-xs">
                Stream ID: {streamData.id}
              </div>
            </div>
          </div>
          <StreamUserDetails streamData={streamData} />
        </div>

        <div className="w-1/3">
          <StreamChat streamId={streamData.id} />
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default VodStream;
