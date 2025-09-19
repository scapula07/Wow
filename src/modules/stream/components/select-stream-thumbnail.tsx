import { ImageUp } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  setFile: (file: File | null) => void;
};

const SelectStreamThumbnail = ({ setFile }: Props) => {
  const [preview, setPreview] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };
  return (
    <div
      className="w-full h-full flex items-center justify-center relative rounded-[10px]"
      style={{
        background: "#FFFFFFE5",
        backgroundImage: `url(${preview})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <ImageUp
        size={80}
        className="text-[#6563FF] cursor-pointer"
        onClick={() => inputRef.current?.click()}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        id="profile-upload"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default SelectStreamThumbnail;
