import { Input } from "@/components/ui/input";
import { useStream } from "../hooks/useStream";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import useDisclosure from "@/lib/hooks/use-disclosure";
import { toast } from "sonner";
import CreateStream from "./dialogs/create-stream";
import type { StreamData } from "../types/stream.types";

interface NormalStreamProps {
  streamData?: StreamData | null;
}

const NormalStream = ({ streamDetails }: any) => {
  // const { streamDetails } = useStream();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  const handleStart = () => {
    if (streamDetails?.id) {
      // Navigate to live stream page with the actual stream ID
      navigate(`/streams/${streamDetails?.id}/live`);
    } else {
      toast.error("Stream data not available. Please try again.");
      onOpen();
    }
  };
  console.log("🚀 NormalStream streamDetails:", streamDetails);
  return (
    <div className="mt-3 sm:mt-5 w-full max-w-full sm:max-w-[500px] md:max-w-[600px] xl:max-w-[672px] mx-auto px-2 sm:px-0">
      <div className="flex flex-col space-y-4 sm:space-y-6 bg-[#232222] w-full p-4 sm:p-6 md:p-10 rounded-[10px]">
        <h3 className="text-xl sm:text-2xl font-semibold">Stream Setup</h3>

        <div className="flex flex-col space-y-2 sm:space-y-3">
          <label className="text-sm sm:text-base text-[#FAFAFA]">Stream Name</label>
          <Input
            value={streamDetails?.streamName}
            placeholder="Give your stream a name"
            className="h-12 sm:h-14 rounded-[8px] !border-[#383A3F] placeholder:text-[#FAFAFAB2] w-full text-sm sm:text-base"
            readOnly
          />
        </div>

        <div className="flex flex-col space-y-2 sm:space-y-3">
          <p className="font-semibold text-sm sm:text-base">Livechat</p>
          <RadioGroup
            defaultValue="yes"
            className="flex items-center space-x-4 sm:space-x-8"
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <RadioGroupItem value="yes" id="yes" />
              <label htmlFor="yes" className="text-sm sm:text-base">Yes</label>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <RadioGroupItem value="no" id="no" />
              <label htmlFor="no" className="text-sm sm:text-base">No</label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex flex-col space-y-2 sm:space-y-3">
          <p className="font-semibold text-sm sm:text-base">Visibility</p>
          <RadioGroup
            defaultValue="public"
            className="flex items-center space-x-4 sm:space-x-8"
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <RadioGroupItem value="public" id="public" />
              <label htmlFor="public" className="text-sm sm:text-base">Public</label>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <RadioGroupItem value="private" id="private" />
              <label htmlFor="private" className="text-sm sm:text-base">Private</label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex flex-col space-y-2 sm:space-y-3">
          <p className="font-semibold text-sm sm:text-base">Who can send message</p>
          <RadioGroup
            defaultValue="anyone"
            className="flex items-center space-x-4 sm:space-x-8"
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <RadioGroupItem value="anyone" id="anyone" />
              <label htmlFor="anyone" className="text-sm sm:text-base">Anyone</label>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <RadioGroupItem value="followers" id="followers" />
              <label htmlFor="followers" className="text-sm sm:text-base">Followers</label>
            </div>
          </RadioGroup>
        </div>

        <Button className="w-full sm:w-fit my-2 h-12 text-sm sm:text-base" onClick={handleStart}>
          Start Stream
        </Button>
      </div>      <CreateStream open={isOpen} onClose={onClose} />
    </div>
  );
};

export default NormalStream;
