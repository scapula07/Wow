import { useState } from "react";

export interface IOnCloseDisclosure {
  onClose: () => void;
}

const useDisclosure = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };
  return {
    isOpen,
    onOpen,
    onClose,
  };
};

export default useDisclosure;
