import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, Phone } from "lucide-react";

type Props = {
  micOn: boolean;
  setMicOn: (micOn: boolean) => void;
  camOn: boolean;
  setCamOn: (camOn: boolean) => void;
};

const StreamControls = ({ micOn, setMicOn, camOn, setCamOn }: Props) => {
  return (
    <div className="flex items-center justify-center gap-4 bg-black p-4">
      {/* Mic Button */}
      <Button
        onClick={() => setMicOn(!micOn)}
        className="rounded-xl bg-neutral-800 hover:bg-neutral-700 p-3"
        variant="ghost"
      >
        {micOn ? (
          <Mic className="text-white w-6 h-6" />
        ) : (
          <MicOff className="text-white w-6 h-6" />
        )}
      </Button>

      {/* Camera Button */}
      <Button
        onClick={() => setCamOn(!camOn)}
        className="rounded-xl bg-neutral-800 hover:bg-neutral-700 p-3"
        variant="ghost"
      >
        {camOn ? (
          <Video className="text-white w-6 h-6" />
        ) : (
          <VideoOff className="text-white w-6 h-6" />
        )}
      </Button>

      {/* End Call */}
      <Button
        className="rounded-xl bg-red-600 hover:bg-red-700 p-3"
        variant="ghost"
      >
        <Phone className="text-white w-6 h-6 rotate-135" />
      </Button>
    </div>
  );
};

export default StreamControls;
