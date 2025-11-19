import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function BrowseRecommendedDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center justify-between bg-[#121212] text-white font-medium rounded-lg px-4 py-2 hover:bg-[#1a1a1a]">
          <span>Recommended For You</span>
          <ChevronDown className="w-8 h-8" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#121212] text-white border border-[#2a2a2a]">
        <DropdownMenuItem className="hover:bg-[#1a1a1a] cursor-pointer">
          Trending
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-[#1a1a1a] cursor-pointer">
          New Releases
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-[#1a1a1a] cursor-pointer">
          Most Popular
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
