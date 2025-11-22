import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router";
import { authApi } from "@/firebase/auth";
import { useAuthStore } from "@/store";
import { FcGoogle } from "react-icons/fc";
const GoogleAuth = ({ text }: { text?: string }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, setError } = useAuthStore();

  const handleGoogleClick = async () => {
    setError(null);
    setLoading(true);
    try {
      let res;
      if (text && text.toLowerCase().includes("login")) {
        res = await authApi.googleLogin();
      } else {
        res = await authApi.googleAuth();
      }
      if (!res || (typeof res === 'object' && 'error' in res)) {
        setError((res && (res as any).error) || "Google authentication failed");
      } else {
        // Convert the response to the expected User type
        const user = {
          email: (res as any).email || '',
          onboarded: (res as any).onboarded || false,
          ...res
        };
        login(user);
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "Google authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full font-bold mt-4.5 bg-inherit h-14 border-[#383A3F] rounded-[8px]"
      onClick={handleGoogleClick}
      disabled={loading}
    >
     <FcGoogle className=""/>
      {loading ? "Processing..." : text ? text : "Continue with Google"}
    </Button>
  );
};

export default GoogleAuth;
