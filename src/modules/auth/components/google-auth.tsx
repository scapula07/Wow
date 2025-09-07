import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router";
import { authApi } from "@/firebase/auth";

const GoogleAuth = ({ text }: { text?: string }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
        localStorage.clear();
        localStorage.setItem('user', JSON.stringify(res));
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
      <img
        width={24}
        height={24}
        src="/src/assets/images/gwid-google-auth.svg"
        alt="Continue with google"
        className="mr-1"
      />{" "}
      {loading ? "Processing..." : text ? text : "Continue with Google"}
    </Button>
  );
};

export default GoogleAuth;
