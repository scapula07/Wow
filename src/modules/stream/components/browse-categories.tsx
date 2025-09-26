import { Input } from "@/components/ui/input";
import { BrowseRecommendedDropdown } from "./browse-recommended-dropdown";
import { SearchIcon } from "lucide-react";
import LivestreamCategoryCard from "@/components/livestream-category-card";

type Props = {
  following?: boolean;
};

const BrowseCategories = ({ following }: Props) => {
  return (
    <div>
      {!following && (
        <div className="flex items-center justify-between space-x-10 mb-8">
          <div className="bg-[#141414] w-full !h-12 relative">
            <Input
              placeholder="Search category tags"
              className="pl-11 border-none !bg-inherit !text-white !h-full !w-full"
            />
            <SearchIcon className="text-[#5B5B5B] absolute left-2 top-1/2 -translate-y-1/2 placeholder:text-[#9F9F9F]" />
          </div>
          <BrowseRecommendedDropdown />
        </div>
      )}

      <div className="grid md:grid-cols-4 grid-cols-1 gap-x-5 gap-y-8">
        {[...Array(9)].map((_, i) => (
          <div className="h-[200px]" key={i}>
            <LivestreamCategoryCard views={Math.floor(Math.random() * 1000)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseCategories;
