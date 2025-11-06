import LivestreamCategoryCard from "@/components/livestream-category-card";

const LivestreamCategories = () => {
  return (
    <div className="flex flex-col space-y-4 mb-12">
      <h2 className="md:text-2xl text-xl text-center md:text-left font-medium">
        Livestream Categories you might like
      </h2>
      <div className="flex items-center overflow-x-auto no-scrollbar md:-mr-10 -mx-5 pl-4">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div className="w-fit mr-4" key={i}>
              <div className="min-w-[300px] w-[300px] h-[200px]">
                <LivestreamCategoryCard />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LivestreamCategories;
