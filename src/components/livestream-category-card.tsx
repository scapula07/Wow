import { Eye } from "lucide-react";

type Props = {
  views?: number;
};

const LivestreamCategoryCard = ({ views }: Props) => {
  return (
    <div
      className="w-full h-full inset-0 bg-black/50 relative flex items-end rounded-[6px] p-3"
      style={{
        backgroundImage: `url(assets/images/wow-live-sample.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      {views && (
        <div className="flex bg-[#575757E5] rounded-r-[6.04px] py-2 px-3 items-center space-x-2 absolute top-4 left-0">
          <Eye className="text-white text-2xl" />
          <span className="font-medium text-sm">47.7k</span>
        </div>
      )}
      <p className="font-semibold">Aliens & Encounters</p>
    </div>
  );
};

export default LivestreamCategoryCard;
