import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";
import { useState } from "react";

interface BlockStreamModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  streamName?: string;
  isBlocking: boolean;
}

const BLOCK_REASONS = [
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "spam", label: "Spam or misleading" },
  { value: "harassment", label: "Harassment or hate speech" },
  { value: "violence", label: "Violence or dangerous content" },
  { value: "copyright", label: "Copyright infringement" },
  { value: "other", label: "Other" },
];

export const BlockStreamModal = ({
  open,
  onClose,
  onConfirm,
  streamName,
  isBlocking,
}: BlockStreamModalProps) => {
  const [selectedReason, setSelectedReason] = useState<string>("");

  const handleConfirm = () => {
    if (selectedReason) {
      onConfirm(selectedReason);
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#1a1a1a] text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl">Block Stream</DialogTitle>
          <DialogDescription className="text-gray-400">
            {streamName && (
              <span className="block mb-2">
                You are about to block "{streamName}"
              </span>
            )}
            This stream will no longer appear in your feed. Please select a reason:
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
            <div className="space-y-3">
              {BLOCK_REASONS.map((reason) => (
                <div key={reason.value} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={reason.value}
                    id={reason.value}
                    className="border-gray-600"
                  />
                  <Label
                    htmlFor={reason.value}
                    className="text-sm text-gray-300 cursor-pointer hover:text-white transition-colors"
                  >
                    {reason.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isBlocking}
            className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedReason || isBlocking}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isBlocking ? "Blocking..." : "Block Stream"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
