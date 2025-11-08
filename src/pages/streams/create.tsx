import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import NormalStream from "@/modules/stream/components/normal-stream";
import ObsStream from "@/modules/stream/components/obs-stream";
import { MoveLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStream } from "@/modules/stream/hooks/useStream";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import type { StreamData } from "@/modules/stream/types/stream.types";

const CreateStream = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id,"iiiiiiii")
  const { streamDetails } = useStream();
  const navigate = useNavigate();
  const [streamData, setStreamData] = useState<StreamData | null>(null);

  // Monitor stream status and auto-navigate when it goes live
  useEffect(() => {
    if (!id) return;

    console.log("🔍 Monitoring stream for live status:", id);

    // Set up real-time listener for stream document
    const unsubscribe = onSnapshot(
      doc(db, "streams", id),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as StreamData;
          
          // Store stream data in state
          setStreamData({
            ...data,
            id: doc.id
          } as StreamData);
          
          console.log("📡 Stream status update:", {
            isLive: data.isLive,
            isActive: data.isActive
          });

          // When stream goes live, navigate to the stream page
          if (data.isLive) {
            console.log("🔴 Stream is now LIVE! Navigating...");
            toast.success("Stream is now live! 🎉");
            
            // Navigate to the live stream page
            setTimeout(() => {
              navigate(`/streams/${id}/live`);
            }, 1000); // Small delay to show the toast
          }
        }
      },
      (error) => {
        console.error("Error monitoring stream status:", error);
      }
    );

    // Cleanup listener on unmount
    return () => {
      console.log("🧹 Cleaning up stream monitor");
      unsubscribe();
    };
  }, []);

  // Check if we have stream details
  if (!streamDetails.streamId || !streamDetails.name) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-400 text-lg">No stream data available</div>
        <Button onClick={() => navigate("/")} className="text-white">
          <MoveLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  const tabs = [
    {
      id: 0,
      icon: "/assets/icons/wow-tab-2.svg",
    },
    {
      id: 1,
      icon: "/assets/icons/wow-tab-3.svg",
    },
  ];

  return (
    <div className="flex flex-col space-y-5 mt-7">
      <div className="flex items-center relative">
        <Button
          variant="link"
          className="underline absolute text-white text-xs top-0 left-0"
          onClick={() => navigate(`/`)}
        >
          <MoveLeft />
          Back
        </Button>

        <Tabs className="w-full" defaultValue="0">
          <div className="w-full flex items-center justify-center">
            <TabsList className="w-fit bg-inherit items-center text-white h-fit">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id.toString()}
                  className="data-[state=active]:bg-primary rounded-[5px] h-10 !w-32 cursor-pointer"
                >
                  <img
                    src={tab.icon}
                    alt="tab-icon"
                    className="w-[24px] h-[26px]"
                  />
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="0">
            <ObsStream streamDetails={streamData} />
          </TabsContent>

          <TabsContent value="1">
            <NormalStream streamDetails={streamData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateStream;
