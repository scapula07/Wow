import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { copyToClipboard } from "@/lib/utils";
import { Copy, Eye, EyeOff, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { StreamData } from "../types/stream.types";
import { toast } from "sonner";

interface ObsStreamProps {
  streamData?: StreamData | null;
}

const ObsStream = ({ streamDetails }: any) => {
  const [showKey, setShowKey] = useState(false);
  const [showURL, setShowURL] = useState(false);

  // const { streamDetails } = useStream();
  
  // Livepeer RTMP ingest URL
  const rtmpUrl = "rtmp://rtmp.livepeer.com/live";

  const handleCopyStreamKey = () => {
    if (streamDetails?.streamKey) {
      copyToClipboard(streamDetails?.streamKey);
      toast.success("Stream key copied to clipboard!");
    } else {
      toast.error("No stream key available");
    }
  };

  const handleCopyRtmpUrl = () => {
    copyToClipboard(rtmpUrl);
    toast.success("RTMP URL copied to clipboard!");
  };

  return (
    <div className="flex flex-col space-y-6 sm:space-y-10 mt-3 sm:mt-5 w-full max-w-full sm:max-w-[500px] md:max-w-[600px] xl:max-w-[1000px] mx-auto px-2 sm:px-0">
      <div className="flex flex-col items-center justify-center bg-[#232222] h-[300px] sm:h-[400px] md:h-[550px] w-full rounded-[10px]">
        <p className="text-base sm:text-lg md:text-xl font-semibold text-center px-4">
          Connect streaming software to go live
        </p>
      </div>

      <div className="flex flex-col space-y-4 sm:space-y-5">
        <h3 className="text-xl sm:text-2xl font-semibold">Stream details</h3>

        <div className="flex flex-col space-y-4 sm:space-y-5">
          <div className="flex flex-col space-y-2 sm:space-y-3">
            <label className="text-sm sm:text-base text-[#FAFAFA]">Stream Name</label>

            <Input
              value={streamDetails?.streamName}
              placeholder="Give your stream a name"
              className="h-12 rounded-[8px] !border-[#383A3F] placeholder:text-[#FAFAFAB2] md:w-md w-full"
            />
          </div>

          <div className="flex flex-col space-y-2 sm:space-y-3">
            <label className="text-sm sm:text-base text-[#FAFAFA]">Stream Key</label>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="relative md:w-md w-full">
                <Input
                  type={showKey ? "text" : "password"}
                  value={streamDetails?.streamKey || "No stream key available"}
                  placeholder="Stream Key"
                  className="h-12 rounded-[8px] !border-[#383A3F] placeholder:text-[#FAFAFAB2] w-full"
                  readOnly
                />
                {!showKey ? (
                  <EyeOff
                    size={18}
                    className="text-[#939393] absolute right-4 top-4 z-10 cursor-pointer"
                    onClick={() => setShowKey(true)}
                  />
                ) : (
                  <Eye
                    size={18}
                    className="text-[#939393] absolute right-4 top-4 z-10 cursor-pointer"
                    onClick={() => setShowKey(false)}
                  />
                )}
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3">
                <Button
                  className="bg-[#302F2F] border border-[#FAFAFA] rounded-[5px] h-fit py-1 flex-1 sm:flex-none text-xs sm:text-sm"
                  size="sm"
                >
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                  Reset
                </Button>
                <Button
                  className="bg-[#302F2F] border border-[#FAFAFA] rounded-[5px] h-fit py-1 flex-1 sm:flex-none text-xs sm:text-sm"
                  size="sm"
                  onClick={handleCopyStreamKey}
                  disabled={!streamDetails?.streamKey}
                >
                  <Copy size={14} className="w-3 h-3 sm:w-4 sm:h-4" />
                  Copy
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2 sm:space-y-3 pb-10 sm:pb-20">
            <label className="text-sm sm:text-base text-[#FAFAFA]">Stream URL</label>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="relative md:w-md w-full">
                <Input
                  type={showURL ? "text" : "password"}
                  value={rtmpUrl}
                  placeholder="Stream URL"
                  className="h-12 rounded-[8px] !border-[#383A3F] placeholder:text-[#FAFAFAB2] w-full"
                  readOnly
                />
                {!showURL ? (
                  <EyeOff
                    size={18}
                    className="text-[#939393] absolute right-4 top-4 z-10 cursor-pointer"
                    onClick={() => setShowURL(true)}
                  />
                ) : (
                  <Eye
                    size={18}
                    className="text-[#939393] absolute right-4 top-4 z-10 cursor-pointer"
                    onClick={() => setShowURL(false)}
                  />
                )}
              </div>

              <Button
                className="bg-[#302F2F] border border-[#FAFAFA] rounded-[5px] h-fit py-1 text-xs sm:text-sm w-full sm:w-auto"
                size="sm"
                onClick={handleCopyRtmpUrl}
              >
                <Copy size={14} className="w-3 h-3 sm:w-4 sm:h-4" />
                Copy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObsStream;
