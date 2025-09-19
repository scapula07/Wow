import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import NormalStream from "@/modules/stream/components/normal-stream";
import ObsStream from "@/modules/stream/components/obs-stream";
import { MoveLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CreateStream = () => {
  const { name } = useParams<{ name: string }>();

  const navigate = useNavigate();

  const tabs = [
    {
      id: 0,
      icon: "/assets/icons/wow-tab-2.svg",
    },
    {
      id: 1,
      icon: "/assets/icons/wow-tab-3.svg",
    },
  ];

  return (
    <div className="flex flex-col space-y-5 mt-7">
      <div className="flex items-center relative">
        <Button
          variant="link"
          className="underline absolute text-white text-xs top-0 left-0"
          onClick={() => navigate(`/`)}
        >
          <MoveLeft />
          Back
        </Button>

        <Tabs className="w-full" defaultValue="0">
          <div className="w-full flex items-center justify-center">
            <TabsList className="w-fit bg-inherit items-center text-white h-fit">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id.toString()}
                  className="data-[state=active]:bg-primary rounded-[5px] h-10 !w-32 cursor-pointer"
                >
                  <img
                    src={tab.icon}
                    alt="tab-icon"
                    className="w-[24px] h-[26px]"
                  />
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="0">
            <ObsStream />
          </TabsContent>

          <TabsContent value="1">
            <NormalStream name={name as string} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateStream;
