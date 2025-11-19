import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BrowseChannels from "@/modules/stream/components/browse-channel";
const Following = () => {
  return (
    <div className="mt-10 flex flex-col space-y-4">
      <h1 className="font-semibold text-[40px]">Following</h1>

      <Tabs className="w-full" defaultValue="channels">
        <TabsList className="w-fit bg-inherit items-center text-white h-fit mb-5">
          {["channels", "live", "categories"].map((tab, index) => (
            <TabsTrigger
              key={index}
              value={tab}
              className="data-[state=active]:underline bg-inherit data-[state=active]:!bg-inherit px-0 pr-6 cursor-pointer text-white text-xl font-semibold data-[state=active]:text-primary capitalize"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
    
        <TabsContent value="live">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-2">Coming Soon</h3>
              <p className="text-gray-400">Live streams following feature is coming soon!</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="channels">
          <BrowseChannels following />
        </TabsContent>

        <TabsContent value="categories">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-2">Coming Soon</h3>
              <p className="text-gray-400">Categories following feature is coming soon!</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Following;
