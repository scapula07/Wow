import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  LayoutGrid,
} from "lucide-react";
import SidebarItem from "../sidebar-item";
import { VStack } from "../ui/stack";
import ChannelLists from "../channel-list";
import { useLocation } from "react-router";

type Props = {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
};

const Sidebar = ({ expanded, setExpanded }: Props) => {
  const { pathname } = useLocation();

  return (
    <aside
      className={cn(
        "fixed top-0 left-3 h-screen bg-[#141414]  text-white flex flex-col transition-all duration-300 rounded-[15px] px-3 py-6",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div>
        <VStack
          className={cn("mb-14 flex items-center", expanded && "items-start")}
        >
          {!expanded && (
            <img
              src="/assets/images/wow-logo.svg"
              alt="WOW"
              className="w-8 h-8"
            />
          )}
          {expanded && (
            <img
              src="/assets/icons/wow-logo-full.svg"
              alt="WOW"
              className="w-[85px] h-[24px]"
            />
          )}
          <div className="w-full relative z-50">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#141414] absolute -right-7 top-3 bg-primary w-[30px] h-[30px]"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </div>
        </VStack>

        <nav
          className={cn(
            "flex flex-col items-center space-y-14 mb-16",
            expanded && "items-start"
          )}
        >
          <SidebarItem
            icon={<Home size={20} />}
            label="Home"
            expanded={expanded}
            link="/"
            active={pathname === "/"}
          />
          <SidebarItem
            icon={<LayoutGrid size={20} />}
            label="Browse"
            expanded={expanded}
            link="/browse"
            active={pathname.includes("browse")}
          />
          <SidebarItem
            icon={<Heart size={20} absoluteStrokeWidth />}
            label="Following"
            expanded={expanded}
            link="/following"
            active={pathname.includes("following")}
          />
        </nav>
      </div>

      <hr className="border-primary" />

      <ChannelLists expanded={expanded} />
    </aside>
  );
};

export default Sidebar;
