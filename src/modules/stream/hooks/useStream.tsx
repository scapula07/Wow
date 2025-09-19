import { useLocalStorage } from "usehooks-ts";

const storageKey = "stream-details";

type StreamDetails = {
  name: string;
  category: string;
  schedule: string;
  thumbnail: File | null;
};

export const useStream = () => {
  const [streamDetails, setStreamDetails] = useLocalStorage<StreamDetails>(
    storageKey,
    {
      name: "",
      category: "",
      schedule: "",
      thumbnail: null,
    }
  );

  const setStreamDetailsLocal = (data: StreamDetails) => {
    setStreamDetails(data);
  };

  const clearStreamDetails = () => {
    setStreamDetailsLocal({
      name: "",
      category: "",
      schedule: "",
      thumbnail: null,
    });
  };

  return {
    streamDetails,
    setStreamDetails,
    clearStreamDetails,
  };
};
