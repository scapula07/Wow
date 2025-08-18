import { Button } from "@/components/ui/button";

const GoogleAuth = ({ text }: { text?: string }) => {
  return (
    <Button
      variant="outline"
      className="w-full font-bold mt-4.5 bg-inherit h-14 border-[#383A3F] rounded-[8px]"
    >
      <img
        width={24}
        height={24}
        src="/src/assets/images/gwid-google-auth.svg"
        alt="Continue with google"
        className="mr-1"
      />{" "}
      {text ? text : "Continue with Google"}
    </Button>
  );
};

export default GoogleAuth;
