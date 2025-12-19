import { Input } from "@/components/ui/input";
import { BrowseRecommendedDropdown } from "./browse-recommended-dropdown";
import { SearchIcon, ArrowLeft } from "lucide-react";
import LivestreamCategoryCard from "@/components/livestream-category-card";
import { LIVESTREAM_CATEGORIES, type CategoryData, type SubCategoryData } from "@/lib/constants/livestream-categories";
import { useState, useEffect, useMemo } from "react";
import { categoryCountCache } from "@/lib/utils/category-counter";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Props = {
  following?: boolean;
};

const BrowseCategories = ({ following }: Props) => {
  const [categories, setCategories] = useState<CategoryData[]>(LIVESTREAM_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return categories;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return categories.filter(category => 
      category.name.toLowerCase().includes(lowerSearchTerm) ||
      category.description.toLowerCase().includes(lowerSearchTerm)
    );
  }, [categories, searchTerm]);

  // Filter subcategories based on search term
  const filteredSubcategories = useMemo(() => {
    if (!selectedCategory?.subcategories) {
      return [];
    }

    if (!searchTerm.trim()) {
      return selectedCategory.subcategories;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return selectedCategory.subcategories.filter(subcategory =>
      subcategory.name.toLowerCase().includes(lowerSearchTerm) ||
      subcategory.description.toLowerCase().includes(lowerSearchTerm)
    );
  }, [selectedCategory, searchTerm]);

  const handleCategoryClick = (category: CategoryData) => {
    if (category.subcategories && category.subcategories.length > 0) {
      // Show subcategories
      setSelectedCategory(category);
      setShowSubcategories(true);
    } else {
      // Navigate to streams for this category
      navigate(`/browse?category=${category.id}`);
    }
  };

  const handleSubcategoryClick = (subcategory: SubCategoryData) => {
    // Navigate to streams for this subcategory
    navigate(`/browse?category=${subcategory.id}`);
  };

  const handleBackToCategories = () => {
    setShowSubcategories(false);
    setSelectedCategory(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div>
      {!following && (
        <div className="flex items-center justify-between space-x-10 mb-8">
          <div className="bg-[#141414] w-full !h-12 relative">
            <Input
              placeholder="Search category tags"
              className="pl-11 border-none !bg-inherit !text-white !h-full !w-full"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <SearchIcon className="text-[#5B5B5B] absolute left-2 top-1/2 -translate-y-1/2 placeholder:text-[#9F9F9F]" />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          <BrowseRecommendedDropdown />
        </div>
      )}

      {showSubcategories && selectedCategory ? (
        <div>
          <Button
            variant="ghost"
            onClick={handleBackToCategories}
            className="mb-6 text-white hover:text-primary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Button>
          
          <h2 className="text-2xl font-semibold mb-6 text-white">
            {selectedCategory.name}
            {searchTerm && (
              <span className="text-gray-400 text-base ml-3 font-normal">
                ({filteredSubcategories.length} result{filteredSubcategories.length !== 1 ? 's' : ''})
              </span>
            )}
          </h2>

          {filteredSubcategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No subcategories found matching "{searchTerm}"</p>
              <button
                onClick={handleClearSearch}
                className="text-primary hover:underline mt-2"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-4 grid-cols-1 gap-x-5 gap-y-8">
              {filteredSubcategories.map((subcategory) => (
                <div 
                  className="h-[200px]" 
                  key={subcategory.id}
                >
                  <LivestreamCategoryCard 
                    category={subcategory as any}
                    onClick={() => handleSubcategoryClick(subcategory)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {searchTerm && (
            <div className="mb-4 text-gray-400">
              Found {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'}
            </div>
          )}

          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No categories found matching "{searchTerm}"</p>
              <button
                onClick={handleClearSearch}
                className="text-primary hover:underline mt-2"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-4 grid-cols-1 gap-x-5 gap-y-8">
              {filteredCategories.map((category) => (
                <div 
                  className="h-[200px]" 
                  key={category.id}
                >
                  <LivestreamCategoryCard 
                    category={category}
                    onClick={() => handleCategoryClick(category)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrowseCategories;
