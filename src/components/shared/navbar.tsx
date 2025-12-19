import { HStack } from "../ui/stack";
import { Input } from "../ui/input";
import { SearchIcon, Video, LogOut, X } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import useDisclosure from "@/lib/hooks/use-disclosure";
import CreateStream from "@/modules/stream/components/dialogs/create-stream";
import { useAuth } from "@/lib/hooks/use-auth";
import MobileSidebar from "./mobile-sidebar";
import { useState, useEffect, useRef } from "react";
import { AlignJustify } from "lucide-react";
import { useSearch } from "@/lib/hooks/use-search";
import { SearchResultsPanel } from "../search-results";
import { MobileSearch } from "../mobile-search";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { search, loading, results, clearResults } = useSearch();
  const searchRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        search(searchTerm);
        setShowResults(true);
      } else {
        clearResults();
        setShowResults(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, search, clearResults]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClearSearch = () => {
    setSearchTerm('');
    clearResults();
    setShowResults(false);
  };

  const handleSearchFocus = () => {
    if (searchTerm.trim()) {
      setShowResults(true);
    }
  };

  return (
    <HStack className="pt-5 px-5 pb-5 items-center justify-between bg-[#141414] md:bg-inherit md:pb-0 -mx-5 md:mx-0 md:px-0 sticky md:static top-0 z-50 shadow-2xl">
      <img
        src="/assets/icons/wow-logo-full.svg"
        alt="WOW"
        className="w-[85px] h-[24px] md:hidden"
      />

      {/* Mobile Search Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setShowMobileSearch(true)}
      >
        <SearchIcon className="!w-6 !h-6 text-white" />
      </Button>

      <div className="bg-[#141414] lg:w-[400px] xl:w-[500px] md:w-2/5 !h-12 relative lg:left-20 md:left-10 hidden md:block" ref={searchRef}>
        <Input
          placeholder="Search for streamers, streams, or categories"
          className="pl-10 pr-10 border-none !bg-inherit !text-white !h-full !w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleSearchFocus}
        />
        <SearchIcon className="text-[#5B5B5B] absolute left-2 top-1/2 -translate-y-1/2 placeholder:text-[#9F9F9F]" />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        {/* Search Results Panel */}
        {showResults && (
          <SearchResultsPanel
            results={results}
            loading={loading}
            searchTerm={searchTerm}
            onClose={() => setShowResults(false)}
          />
        )}
      </div>

      <HStack className="space-x-5 hidden md:flex">
        {!isLoggedIn ? (
          <>
            <Button 
              className="bg-[#3A3A3A] rounded-[20px] w-fit text-sm font-semibold py-5"
              onClick={() => navigate("/auth/login")}
            >
              Log In
            </Button>
            <Button 
              className="rounded-[20px] w-fit text-sm font-semibold py-5"
              onClick={() => navigate("/auth/signup")}
            >
              Sign Up
            </Button>
          </>
        ) : (
          <>
            <span 
              className="text-white text-sm flex items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate(`/user/${user?.id}/profile`)}
            >
              Welcome, {user?.email}
            </span>
            <Button 
              className="bg-[#3A3A3A] rounded-[20px] w-fit text-sm font-semibold py-5"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </>
        )}
        <Button
          className="rounded-[20px] w-fit text-sm font-semibold py-5 pl-1"
          onClick={isLoggedIn ? onOpen : () => navigate('/auth/login')}
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

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <MobileSearch onClose={() => setShowMobileSearch(false)} />
      )}
    </HStack>
  );
};

export default Navbar;
