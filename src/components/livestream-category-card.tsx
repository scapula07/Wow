// import { Eye } from "lucide-react";
import type { CategoryData } from "@/lib/constants/livestream-categories";
import { PiRecordFill } from "react-icons/pi";
import { ChevronRight } from "lucide-react";

type Props = {
  category?: CategoryData;
  views?: number;
  onClick?: () => void;
};

const LivestreamCategoryCard = ({ category, views, onClick }: Props) => {
  // Format stream count
  const formatStreamCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const displayStreams = category?.streamCount || views || 0;
  const categoryName = category?.name || "Aliens & Encounters";
  const backgroundImage = category?.image || "assets/images/wow-live-sample.jpg";

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-full h-full inset-0 bg-black/50 relative flex items-end rounded-[6px] p-3 cursor-pointer hover:opacity-90 transition-opacity group"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[6px]" />

      {displayStreams > 0 && (
        <div className="flex bg-[#575757E5] rounded-r-[6.04px] py-2 px-3 items-center space-x-2 absolute top-4 left-0 z-10">
          <PiRecordFill className="text-red-500 w-4 h-4" />
          <span className="font-medium text-sm">{formatStreamCount(displayStreams)} streams</span>
        </div>
      )}

      {/* Show subcategory indicator */}
      {category?.subcategories && category.subcategories.length > 0 && (
        <div className="absolute top-4 right-4 z-10 bg-primary/80 rounded-full p-1.5">
          <ChevronRight className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className="z-10 relative">
        <p className="font-semibold text-white">{categoryName}</p>
        {category?.description && (
          <p className="text-xs text-gray-300 mt-1 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default LivestreamCategoryCard;
