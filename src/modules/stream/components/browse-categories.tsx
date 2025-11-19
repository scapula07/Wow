import { Input } from "@/components/ui/input";
import { BrowseRecommendedDropdown } from "./browse-recommended-dropdown";
import { SearchIcon } from "lucide-react";
import LivestreamCategoryCard from "@/components/livestream-category-card";
import { LIVESTREAM_CATEGORIES, type CategoryData } from "@/lib/constants/livestream-categories";
import { useState, useEffect } from "react";
import { categoryCountCache } from "@/lib/utils/category-counter";

type Props = {
  following?: boolean;
};

const BrowseCategories = ({ following }: Props) => {
  const [categories, setCategories] = useState<CategoryData[]>(LIVESTREAM_CATEGORIES);
  

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const counts = await categoryCountCache.getCounts();

        // Update categories with real counts from database
        const updatedCategories = LIVESTREAM_CATEGORIES.map(category => ({
          ...category,
          streamCount: counts[category.id] || 0
        }));

        // Sort by stream count (highest to lowest)
        const sortedCategories = updatedCategories.sort((a, b) => 
          (b.streamCount || 0) - (a.streamCount || 0)
        );

        setCategories(sortedCategories);
      } catch (error) {
        console.error("Error fetching category counts:", error);
      }
    };

    fetchCategoryCounts();
  }, []);
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
        {categories.map((category) => (
          <div className="h-[200px]" key={category.id}>
            <LivestreamCategoryCard category={category} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseCategories;
