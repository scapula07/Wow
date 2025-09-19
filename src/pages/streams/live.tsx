import StreamChat from "@/modules/stream/components/stream-chat";
import StreamControls from "@/modules/stream/components/stream-controls";
import StreamUserDetails from "@/modules/stream/components/stream-user-details";
import { useState } from "react";

const LiveStream = () => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  return (
    <div className="flex space-x-6 px-4 py-5">
      <div className="flex flex-col space-y-12 w-full md:w-2/3">
        <div className="flex flex-col space-y-1">
          <div className="w-full h-[400px] bg-[#232222] rounded-[10px]"></div>
          <StreamControls
            micOn={micOn}
            setMicOn={setMicOn}
            camOn={camOn}
            setCamOn={setCamOn}
          />
        </div>
        <StreamUserDetails />
      </div>

      <div className="w-1/3">
        <StreamChat />
      </div>
    </div>
  );
};

export default LiveStream;
