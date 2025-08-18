import { type FC, type PropsWithChildren } from "react";
import { VStack } from "../ui/stack";

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <VStack className="w-full items-center justify-center !text-[#FAFAFA]">
      {children}
    </VStack>
  );
};

export default AuthLayout;
