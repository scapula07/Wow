import LivestreamCategoryCard from "@/components/livestream-category-card";
import { LIVESTREAM_CATEGORIES, type CategoryData } from "@/lib/constants/livestream-categories";
import { useState, useEffect } from "react";
import { categoryCountCache } from "@/lib/utils/category-counter";

const LivestreamCategories = () => {
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
    <div className="flex flex-col space-y-4 mb-12">
      <h2 className="md:text-2xl text-xl text-center md:text-left font-medium">
        Livestream Categories you might like
      </h2>
      <div className="flex items-center overflow-x-auto no-scrollbar md:-mr-10 -mx-5 pl-4">
        {categories.map((category) => (
          <div className="w-fit mr-4" key={category.id}>
            <div className="min-w-[300px] w-[300px] h-[200px]">
              <LivestreamCategoryCard category={category} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivestreamCategories;
