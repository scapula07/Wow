import { VStack } from "@/components/ui/stack";
import SuccessAlert from "@/components/alerts/success-alert";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PasswordUpdateSuccess = () => {
  return (
    <VStack className="space-y-7 w-full min-w-full">
      <SuccessAlert message="Password updated successfully" />
      <h3 className="text-[#FAFAFA] font-semibold text-center text-[28px]">
        PASSWORD UPDATED
      </h3>
      <img
        src="/src/assets/icons/wow-check.svg"
        className="w-[120px] h-[120px] block mx-auto"
        alt="Success"
      />
      <p className="text-[#525252] text-xl text-center">
        Your password has been updated
      </p>
      <Link to="/auth/login" className="w-full">
        <Button className="w-full h-14 font-bold text-xl">Back to Login</Button>
      </Link>
    </VStack>
  );
};

export default PasswordUpdateSuccess;
