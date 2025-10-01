import { HStack } from "../ui/stack";
import { Input } from "../ui/input";
import { SearchIcon, Video, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import useDisclosure from "@/lib/hooks/use-disclosure";
import CreateStream from "@/modules/stream/components/dialogs/create-stream";
import { useAuth } from "@/lib/hooks/use-auth";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

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
            <span className="text-white text-sm flex items-center">Welcome, {user?.email}</span>
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

      <CreateStream open={isOpen} onClose={onClose} />
    </HStack>
  );
};

export default Navbar;
