import LivestreamCard from "@/components/livestream-card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Link } from "react-router-dom";

const LivestreamsForYou = () => {
  return (
    <div className="flex flex-col space-y-4 pb-10">
      <div className="flex md:flex-row flex-col md:space-y-0 space-y-5 items-center justify-between">
        <h2 className="md:text-2xl text-xl font-medium">
          Livestreams For You{" "}
        </h2>
        <div className="flex items-center">
          <Link to="/browse">
            <Button variant="link" className="hover:no-underline">
              View all
            </Button>
          </Link>
          <Button className="bg-[#3A3A3A] text-[#FAFAFAB2] rounded-[20px] h-10 !px-4">
            <Filter />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 grid-cols-1 gap-x-5 gap-y-8">
        {[...Array(9)].map((_, i) => (
          <LivestreamCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default LivestreamsForYou;
