import { HStack } from "../ui/stack";
import { Input } from "../ui/input";
import { SearchIcon, Video, AlignJustify } from "lucide-react";
import { Button } from "../ui/button";
import useDisclosure from "@/lib/hooks/use-disclosure";
import CreateStream from "@/modules/stream/components/dialogs/create-stream";
import MobileSidebar from "./mobile-sidebar";
import { useState } from "react";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [expanded, setExpanded] = useState(false);

  return (
    <HStack className="pt-5 px-5 pb-5 items-center justify-between bg-[#141414] md:bg-inherit md:pb-0 -mx-5 md:mx-0 md:px-0 sticky md:static top-0 z-50 shadow-2xl">
      <img
        src="/assets/icons/wow-logo-full.svg"
        alt="WOW"
        className="w-[85px] h-[24px] md:hidden"
      />

      <div className="bg-[#141414] lg:w-[400px] xl:w-[500px] md:w-2/5 !h-12 relative lg:left-20 md:left-10 hidden md:block">
        <Input
          placeholder="Search"
          className="pl-10 border-none !bg-inherit !text-white !h-full !w-full"
        />
        <SearchIcon className="text-[#5B5B5B] absolute left-2 top-1/2 -translate-y-1/2 placeholder:text-[#9F9F9F]" />
      </div>

      <HStack className="space-x-5 hidden md:flex">
        <Button className="bg-[#3A3A3A] rounded-[20px] w-fit text-sm font-semibold py-5">
          Log In
        </Button>
        <Button className="rounded-[20px] w-fit text-sm font-semibold py-5">
          Sign Up
        </Button>
        <Button
          className="rounded-full w-fit p-1 lg:hidden md:flex hidden"
          onClick={onOpen}
          title="Go Live"
        >
          <div className="w-[31px] h-[31px] rounded-full text-white flex items-center justify-center bg-[#141414]">
            <Video />
          </div>
        </Button>
        <Button
          className="rounded-[20px] w-fit text-sm font-semibold py-5 pl-1 hidden lg:flex"
          onClick={onOpen}
        >
          <div className="w-[31px] h-[31px] rounded-full text-white flex items-center justify-center bg-[#141414]">
            <Video />
          </div>
          Go Live
        </Button>
      </HStack>

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        title="Open Menu"
        onClick={() => setExpanded(true)}
      >
        <AlignJustify className="!w-7 !h-7" />
      </Button>

      <CreateStream open={isOpen} onClose={onClose} />

      <MobileSidebar expanded={expanded} setExpanded={setExpanded} />
    </HStack>
  );
};

export default Navbar;
