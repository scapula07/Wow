import { cn } from "@/lib/utils";
import { Link } from "react-router";

type Props = {
  img: string;
};

const CarouselItem = ({ img }: Props) => {
  return (
    <div
      className=" w-full min-w-full flex flex-col justify-end rounded-[20px]"
      style={{
        height: "360px",
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="w-full flex items-center justify-between bg-[#070707B2] p-4">
        <Link to={`/user/${Math.floor(Math.random() * 100)}/profile`}>
          <div className="flex items-center space-x-3">
            <img
              src={`https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 6) + 1}`}
              alt="wow-live-sample"
              className="w-[53px] h-[53px] rounded-full object-cover"
            />
            <div>
              <h3 className="text-[#FFFFFFE5] font-medium">Wade Fox</h3>
              <p className="text-[#D3CDCDE5] text-[13px] font-medium">
                12.5k Followers
              </p>
            </div>
          </div>
        </Link>

        <span className={cn("text-white text-xs font-semibold")}>
          <span className="text-[#FF0000] text-xl mr-0.5">●</span> 11.7k
        </span>
      </div>
    </div>
  );
};

export default CarouselItem;
