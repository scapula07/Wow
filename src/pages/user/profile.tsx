import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProfileVideoTab from "@/modules/user/components/profile-video-tab";
import ProfileLivestreamTab from "@/modules/user/components/profile-livestream-tab";

const sampleText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.";

const Profile = () => {
  const [expandText, setExpandText] = useState(false);

  const { id } = useParams<{ id: string }>();

  return (
    <div id={id} className="mt-12 flex flex-col space-y-10">
      <div className="flex items-center space-x-7">
        <img
          src="/assets/images/wow-live-sample.jpg"
          alt="profile-pics"
          className="md:w-1/4 w-full h-[250px] max-h-[250px] rounded-[10px] object-cover shadow transition-all duration-500 ease-in-out"
        />

        <div className="flex flex-col space-y-5 max-w-[61%]">
          <h1 className="font-bold text-[40px] leading-12">
            Space Theory & Cosmic Mysteries
          </h1>

          <p className="text-2xl font-medium">
            147k <span className="text-[#FFFFFFB2]">viewers</span>{" "}
            <span className="text-xs mx-1 relative bottom-0.5">●</span> 2.43M{" "}
            <span className="text-[#FFFFFFB2]">followers</span>
          </p>

          <div
            className="font-medium text-base !transition-all !duration-500 !ease-in-out overflow-hidden"
            style={{
              maxHeight: expandText ? "500px" : "50px",
            }}
          >
            {expandText
              ? sampleText
              : sampleText.slice(0, 200) +
                `${sampleText.length > 200 ? "..." : ""}`}
            <button
              className="bg-none w-fit h-0 relative bottom-4 cursor-pointer inline"
              onClick={() => setExpandText(!expandText)}
            >
              <ChevronDown
                style={{
                  transform: expandText ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "all 0.2s ease-in-out",
                }}
              />
            </button>
          </div>

          <Button className="text-[#141414] font-semibold w-fit px-12 mt-3 rounded-[5px]">
            Follow
          </Button>
        </div>
      </div>

      <Tabs className="w-full" defaultValue="livestreams">
        <TabsList className="w-fit bg-inherit items-center text-white h-fit mb-5">
          {["livestreams", "videos"].map((tab, index) => (
            <TabsTrigger
              key={index}
              value={tab}
              className="data-[state=active]:bg-primary bg-[#141414] rounded-[5px] h-10 px-20 cursor-pointer text-white capitalize"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="livestreams">
          <ProfileLivestreamTab />
        </TabsContent>

        <TabsContent value="videos">
          <ProfileVideoTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
