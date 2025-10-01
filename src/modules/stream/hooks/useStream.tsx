import { useLocalStorage } from "usehooks-ts";

const storageKey = "stream-details";

type StreamDetails = {
  name: string;
  category: string;
  schedule: string;
  thumbnail: File | null;
  streamId?: string;
  streamKey?: string;
  playbackId?: string;
  creatorId?: string;
};

export const useStream = () => {
  const [streamDetails, setStreamDetails] = useLocalStorage<StreamDetails>(
    storageKey,
    {
      name: "",
      category: "",
      schedule: "",
      thumbnail: null,
      streamId: undefined,
      streamKey: undefined,
      playbackId: undefined,
      creatorId: undefined,
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
      streamId: undefined,
      streamKey: undefined,
      playbackId: undefined,
      creatorId: undefined,
    });
  };

  return {
    streamDetails,
    setStreamDetails,
    clearStreamDetails,
  };
};
