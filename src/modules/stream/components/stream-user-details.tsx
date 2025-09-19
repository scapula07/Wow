import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const StreamUserDetails = () => {
  return (
    <div className="flex flex-col space-y-7 pb-6">
      <p className="text-xl font-semibold">
        Satellite Blackout? You&apos;re Gonna Wanna See This
      </p>

      <div className="flex w-full justify-between">
        <div className="flex space-x-5">
          <Avatar className="w-[60px] h-[60px]">
            <AvatarImage
              src="https://i.pravatar.cc/40?img=1"
              className="rounded-full"
            />
            <AvatarFallback>DN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-2xl">ZetaTap</h3>
            <p className="text-xl font-medium">
              147k <span className="text-[#FFFFFFB2]">viewers</span>{" "}
              <span className="text-xs mx-1 relative bottom-0.5">●</span> 2.43M{" "}
              <span className="text-[#FFFFFFB2]">followers</span>
            </p>
            <p className="font-medium">@zeta | Zetatap-szn | zeta@email.com</p>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <a href="#" target="_blank" className="flex items-center space-x-3">
            <img
              src="/assets/icons/wow-youtube.svg"
              alt="youtube"
              className="w-[30px] h-[30px]"
            />
            <p className="text-[#FFFFFFB2] font-medium">Youtube</p>
          </a>
          <a href="#" target="_blank" className="flex items-center space-x-3">
            <img
              src="/assets/icons/wow-instagram.svg"
              alt="instagram"
              className="w-[30px] h-[30px]"
            />
            <p className="text-[#FFFFFFB2] font-medium">Instagram</p>
          </a>
          <a href="#" target="_blank" className="flex items-center space-x-3">
            <img
              src="/assets/icons/wow-tiktok.svg"
              alt="tiktok"
              className="w-[30px] h-[30px]"
            />
            <p className="text-[#FFFFFFB2] font-medium">Tiktok</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default StreamUserDetails;
