import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BrowseCategories from "@/modules/stream/components/browse-categories";
import BrowseLivestreams from "@/modules/stream/components/browse-livestream";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Browse = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [activeTab, setActiveTab] = useState<string>("categories");

  // When a category is selected, switch to live channels tab
  useEffect(() => {
    if (categoryParam) {
      setActiveTab("live channels");
    }
  }, [categoryParam]);

  return (
    <div className="mt-10 flex flex-col space-y-4">
      <h1 className="font-semibold text-[40px]">Browse</h1>

      <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-fit bg-inherit items-center text-white h-fit mb-5">
          {["categories", "live channels"].map((tab, index) => (
            <TabsTrigger
              key={index}
              value={tab}
              className="data-[state=active]:underline bg-inherit data-[state=active]:!bg-inherit px-0 pr-6 cursor-pointer text-white text-xl font-semibold data-[state=active]:text-primary capitalize"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="categories">
          <BrowseCategories />
        </TabsContent>

        <TabsContent value="live channels">
          <BrowseLivestreams categoryFilter={categoryParam} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Browse;
