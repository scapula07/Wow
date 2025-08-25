import { cn } from "@/lib/utils";
import { dummyChannels } from "@/lib/constants/data";
import { HStack } from "./ui/stack";

type Props = {
  expanded: boolean;
};

const ChannelLists = ({ expanded }: Props) => {
  return (
    <div className="pt-6 flex-col !items-start">
      {expanded && (
        <h3
          className={cn(
            "text-sm font-semibold mb-2 transition-colors duration-300 text-white whitespace-nowrap"
          )}
        >
          Recommended Channels
        </h3>
      )}

      <div className="flex flex-col mt-6 space-y-8 w-full">
        {dummyChannels.map((ch) => (
          <div
            key={ch.name}
            className="!w-full flex items-center justify-between space-x-3 whitespace-nowrap"
          >
            <HStack className="items-center space-x-2">
              <img
                src={ch.avatar}
                alt={ch.name}
                className="w-7 h-7 rounded-full ml-1"
              />
              <span
                className={cn(
                  "text-xs font-medium flex-1 flex items-center justify-between transform transition-all duration-300",
                  expanded
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-5 pointer-events-none"
                )}
              >
                {ch.name}
              </span>
            </HStack>
            <span
              className={cn(
                "text-white text-xs font-semibold",
                expanded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-5 pointer-events-none"
              )}
            >
              <span className="text-[#FF0000] text-xl mr-0.5">●</span>{" "}
              {ch.viewers}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelLists;
