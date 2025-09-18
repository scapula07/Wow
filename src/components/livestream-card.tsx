import { Button } from "./ui/button";
import { MoreVertical } from "lucide-react";

const LivestreamCard = () => {
  return (
    <div className="flex flex-col space-y-5">
      <div className="w-full h-[195px] relative">
        <img
          src="assets/images/wow-live-sample.jpg"
          alt="live"
          className="w-full h-full rounded-[10.35px]"
        />
        <span className="bg-[#141414B2] px-1.5 rounded-[2px] flex items-center font-semibold text-xs absolute bottom-5 right-3">
          <span className="text-[#FF0000] text-lg mr-1.5">●</span> 11.7k
        </span>
      </div>

      <div className="flex justify-between w-full">
        <div className="flex space-x-3.5">
          <img
            src={`https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 6) + 1}`}
            alt="wow-live-sample"
            className="w-[40px] h-[40px] rounded-full object-cover"
          />
          <div className="flex flex-col space-y-1">
            <p className="font-medium">EyesAbove777</p>
            <p className="text-[#979797] font-semibold">
              They&apos;re Hovering Again: Live Feed from Nevad......
            </p>
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-inherit w-fit p-0 h-fit hover:text-white"
        >
          <MoreVertical />
        </Button>
      </div>
    </div>
  );
};

export default LivestreamCard;
