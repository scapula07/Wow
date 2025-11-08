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
    <div className="mt-5 xl:w-[672px] md:w-[500px] w-[96vh] mx-auto">
      <div className="flex flex-col space-y-6 bg-[#232222] w-full p-10 rounded-[10px]">
        <h3 className="text-2xl font-semibold">Stream Setup</h3>

        <div className="flex flex-col space-y-3">
          <label className="text-base text-[#FAFAFA]">Stream Name</label>
          <Input
            value={streamDetails?.streamName}
            placeholder="Give your stream a name"
            className="h-14 rounded-[8px] !border-[#383A3F] placeholder:text-[#FAFAFAB2] w-full"
            readOnly
          />
        </div>

        <div className="flex flex-col space-y-3">
          <p className="font-semibold">Livechat</p>
          <RadioGroup
            defaultValue="yes"
            className="flex items-center space-x-8"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="yes" id="yes" />
              <label htmlFor="yes">Yes</label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="no" id="no" />
              <label htmlFor="no">No</label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex flex-col space-y-3">
          <p className="font-semibold">Visibility</p>
          <RadioGroup
            defaultValue="public"
            className="flex items-center space-x-8"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="public" id="public" />
              <label htmlFor="public">Public</label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="private" id="private" />
              <label htmlFor="private">Private</label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex flex-col space-y-3">
          <p className="font-semibold">Who can send message</p>
          <RadioGroup
            defaultValue="anyone"
            className="flex items-center space-x-8"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="anyone" id="anyone" />
              <label htmlFor="anyone">Anyone</label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="followers" id="followers" />
              <label htmlFor="followers">Followers</label>
            </div>
          </RadioGroup>
        </div>

        <Button className="w-fit my-2 h-12" onClick={handleStart}>
          Start Stream
        </Button>
      </div>

      <CreateStream open={isOpen} onClose={onClose} />
    </div>
  );
};

export default NormalStream;
