import { HStack, VStack } from "@/components/ui/stack";
import { CheckCircle2Icon } from "lucide-react";

const SuccessAlert = ({ message }: { message: string }) => {
  return (
    <HStack className="space-x-3 border border-primary rounded-lg p-4">
      <CheckCircle2Icon className="h-4 w-4 text-primary" />
      <VStack className="text-sm items-start space-y-1">
        <p className="text-primary leading-4">Success</p>
        <p className="text-white">{message}</p>
      </VStack>
    </HStack>
  );
};

export default SuccessAlert;
