import { HStack } from "../ui/stack";
import { Input } from "../ui/input";
import { SearchIcon, Video } from "lucide-react";
import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <HStack className="pt-5 items-center justify-between">
      <div className="bg-[#141414] w-[500px] !h-12 relative left-20">
        <Input
          placeholder="Search"
          className="pl-10 border-none !bg-inherit !text-white !h-full !w-full"
        />
        <SearchIcon className="text-[#5B5B5B] absolute left-2 top-1/2 -translate-y-1/2 placeholder:text-[#9F9F9F]" />
      </div>

      <HStack className="space-x-5">
        <Button className="bg-[#3A3A3A] rounded-[20px] w-fit text-sm font-semibold py-5">
          Log In
        </Button>
        <Button className="rounded-[20px] w-fit text-sm font-semibold py-5">
          Sign Up
        </Button>
        <Button className="rounded-[20px] w-fit text-sm font-semibold py-5 pl-1">
          <div className="w-[31px] h-[31px] rounded-full text-white flex items-center justify-center bg-[#141414]">
            <Video />
          </div>
          Go Live
        </Button>
      </HStack>
    </HStack>
  );
};

export default Navbar;
