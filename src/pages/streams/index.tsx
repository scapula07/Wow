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
import { livepeerClient } from "@/lib/livepeer";

interface StreamSession {
  id: string;
  parentId: string;
  name: string;
  userId: string;
  createdAt: number;
  lastSeen: number;
  sourceSegments: number;
  transcodedSegments: number;
  sourceSegmentsDuration: number;
  transcodedSegmentsDuration: number;
  recordingStatus: string;
  recordingUrl?: string;
  mp4Url?: string;
  playbackId?: string;
}

// Helper function to create Livepeer source for HLS
const createHlsPlayerSrc = (playbackId: string): Src[] => {
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

// Helper function to create video source for recorded content
const createVideoPlayerSrc = (recordingUrl: string): Src[] => {
  return [
    {
      src: recordingUrl,
      width: 1920,
      height: 1080,
      mime: 'video/mp4' as const,
      type: 'video' as const
    }
  ];
};

const VodStream = () => {
  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerSrc, setPlayerSrc] = useState<Src[] | null>(null);
  const [playbackType, setPlaybackType] = useState<'live' | 'recorded' | null>(null);
  const [recordingSession, setRecordingSession] = useState<StreamSession | null>(null);
  const [allSessions, setAllSessions] = useState<StreamSession[]>([]);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(0);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch stream data and determine playback method
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
          
          // Determine playback method
          await determinePlaybackMethod(data);
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

    const determinePlaybackMethod = async (data: StreamData) => {
      try {
        // Check if stream is currently live
        if (data.isActive && data.isLive && data.playbackId) {
          console.log("Stream is live, using HLS playback");
          setPlaybackType('live');
          const playerSource = createHlsPlayerSrc(data.playbackId);
          setPlayerSrc(playerSource);
          console.log("Generated live player source:", playerSource);
        } else {
          // Stream is offline, try to get recorded sessions
          console.log("Stream is offline, checking for recorded sessions");
          
          // Use parentId if available, otherwise fall back to livepeerStreamId
          const streamId = data.parentId || data.livepeerStreamId;
          
          if (!streamId) {
            throw new Error('No parentId or livepeerStreamId available for recorded playback');
          }

          console.log("Fetching sessions for stream ID:", streamId);
          const sessionsResult = await livepeerClient.getStreamSessions(streamId);
          
          if (!sessionsResult.success) {
            throw new Error(sessionsResult.error || 'Failed to get recorded sessions');
          }

          const sessions = sessionsResult.data as StreamSession[];
          console.log("Retrieved sessions:", sessions);
          
          if (!sessions || sessions.length === 0) {
            throw new Error('No recorded sessions available');
          }

          // Get the most recent completed session
          const completedSessions = sessions.filter(session => 
            session.recordingStatus === 'ready' && 
            (session.mp4Url || session.recordingUrl)
          );

          console.log("Completed sessions:", completedSessions);

          if (completedSessions.length === 0) {
            throw new Error('No completed recorded sessions available');
          }

          // Sort by creation date (most recent first)
          const sortedSessions = completedSessions.sort((a, b) => b.createdAt - a.createdAt);
          
          // Store all sessions for playlist
          setAllSessions(sortedSessions);
          
          // Load the first session (most recent)
          const latestSession = sortedSessions[0];
          
          const recordUrl = latestSession.mp4Url || latestSession.recordingUrl;
          
          if (!recordUrl) {
            throw new Error('No recording URL available');
          }

          console.log("Using recorded session:", latestSession);
          console.log("Recording URL:", recordUrl);
          console.log(`Total sessions available: ${sortedSessions.length}`);

          setPlaybackType('recorded');
          setRecordingSession(latestSession);
          setSelectedSessionIndex(0);
          const playerSource = createVideoPlayerSrc(recordUrl);
          setPlayerSrc(playerSource);
          console.log("Generated recorded player source:", playerSource);
        }
      } catch (err) {
        console.error("Error determining playback method:", err);
        setError(err instanceof Error ? err.message : 'Failed to determine playback method');
      }
    };

    fetchStreamData();
  }, [id]);

  // Format duration from seconds to readable time
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle session selection
  const handleSessionSelect = (index: number) => {
    const session = allSessions[index];
    if (!session) return;

    const recordUrl = session.mp4Url || session.recordingUrl;
    if (!recordUrl) return;

    console.log("Switching to session:", session);
    setSelectedSessionIndex(index);
    setRecordingSession(session);
    const playerSource = createVideoPlayerSrc(recordUrl);
    setPlayerSrc(playerSource);
  };

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
            <div className="w-full h-[400px] rounded-[10px] overflow-hidden relative">
              {/* Live/Recorded indicator */}
              <div className="absolute top-4 left-4 z-10">
                {playbackType === 'live' ? (
                  <span className="bg-red-600 px-3 py-1 rounded text-white text-sm font-bold">
                    🔴 LIVE
                  </span>
                ) : playbackType === 'recorded' ? (
                  <span className="bg-blue-600 px-3 py-1 rounded text-white text-sm font-bold">
                    📹 RECORDED
                  </span>
                ) : null}
              </div>

              {playerSrc ? (
                <PlayerWithControls 
                  src={playerSrc} 
                  key={recordingSession?.id || streamData?.playbackId || 'player'}
                />
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
                {playbackType === 'recorded' && recordingSession && (
                  <span className="text-gray-400 text-xs ml-2">
                    • Recorded {new Date(recordingSession.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="text-gray-400 text-xs">
                Stream ID: {streamData.id}
              </div>
            </div>

            {/* Session Playlist - Only show for recorded content with multiple sessions */}
            {playbackType === 'recorded' && allSessions.length > 1 && (
              <div className="mt-4">
                <h3 className="text-white font-semibold mb-3 text-sm">
                  Previous Recordings ({allSessions.length})
                </h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {allSessions.map((session, index) => (
                    <div
                      key={session.id}
                      onClick={() => handleSessionSelect(index)}
                      className={`
                        flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all
                        ${selectedSessionIndex === index 
                          ? 'bg-primary/20 border-l-4 border-primary' 
                          : 'bg-[#232222] hover:bg-[#2a2a2a]'
                        }
                      `}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {selectedSessionIndex === index && (
                            <span className="text-primary text-xs">▶</span>
                          )}
                          <p className="text-white text-sm font-medium">
                            {new Date(session.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="flex gap-3 mt-1 text-xs text-gray-400">
                          <span>Duration: {formatDuration(session.sourceSegmentsDuration)}</span>
                          {session.sourceSegments > 0 && (
                            <span>• {session.sourceSegments} segments</span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {index === 0 && <span className="text-primary font-semibold">Latest</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
