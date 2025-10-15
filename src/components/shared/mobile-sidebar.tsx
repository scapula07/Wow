import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Heart, Home, LayoutGrid, Video, X } from "lucide-react";
import SidebarItem from "../sidebar-item";
import { useLocation } from "react-router";
import { useEffect, useRef } from "react";

type Props = {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
};

const MobileSidebar = ({ expanded, setExpanded }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { pathname } = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node) && expanded) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expanded, setExpanded]);

  return (
    <aside
      className={cn(
        "fixed top-0 h-screen overflow-y-auto no-scrollbar bg-[#141414] text-white flex-col transition-all duration-300 rounded-[15px] px-3 py-6 !w-64 md:hidden",
        expanded ? "right-0" : "-right-[500px]"
      )}
      ref={containerRef}
    >
      <div className="flex flex-col space-y-12">
        <div className="flex items-center justify-between">
          <img
            src="/assets/images/user.jpeg"
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(false)}
          >
            <X />
          </Button>
        </div>

        <nav className="flex flex-col space-y-10">
          <SidebarItem
            icon={<Home size={20} />}
            label="Home"
            expanded={true}
            link="/"
            active={pathname === "/"}
          />
          <SidebarItem
            icon={<LayoutGrid size={20} />}
            label="Browse"
            expanded={true}
            link="/browse"
            active={pathname.includes("browse")}
          />
          <SidebarItem
            icon={<Heart size={20} absoluteStrokeWidth />}
            label="Following"
            expanded={true}
            link="/following"
            active={pathname.includes("following")}
          />
        </nav>
      </div>

      <hr className="border-primary my-10" />

      <Button
        className="rounded-[20px] w-full text-sm font-semibold py-5 pl-1 flex justify-start"
        // onClick={onOpen}
      >
        <div className="w-[31px] h-[31px] rounded-full text-white flex items-center justify-center bg-[#141414]">
          <Video />
        </div>
        Go Live
      </Button>

      <Button className="bg-[#3A3A3A] rounded-[20px] w-full text-sm font-semibold py-5 mt-5">
        Log In
      </Button>
    </aside>
  );
};

export default MobileSidebar;
