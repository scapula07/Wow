import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@radix-ui/react-avatar";
import { Send } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type UIEvent,
} from "react";

interface Message {
  id: number;
  user: string;
  avatar: string;
  text: string;
}

const StreamChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setShowOverlay(target.scrollTop > 0);
  };

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        user: "You",
        avatar: "https://i.pravatar.cc/40?img=5",
        text: input,
      },
    ]);
    setInput("");
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col rounded-lg h-full overflow-hidden">
      <div className="pt-3 px-3 font-semibold text-white">Live Chat</div>

      <div
        className="relative flex-1 h-full max-h-[70vh] overflow-y-auto no-scrollbar px-3 space-y-4"
        onScroll={handleScroll}
        ref={chatRef}
      >
        {/* Fade overlay at top */}
        {showOverlay && (
          <div className="pointer-events-none sticky top-0 left-0 right-0 h-12 bg-gradient-to-b from-black to-transparent z-10" />
        )}

        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <p>No messages yet</p>
          </div>
        )}

        {messages.length > 0 &&
          messages.map((msg) => (
            <div key={msg.id} className="flex items-start space-x-5 pt-4">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={msg.avatar}
                  alt={msg.user}
                  className="rounded-full"
                />
                <AvatarFallback>DN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1.5">
                <p className="text-sm font-medium text-[#8D8A8AE5]">
                  {msg.user}
                </p>
                <p className="text-white font-medium">{msg.text}</p>
              </div>
            </div>
          ))}
      </div>

      {/* Input box */}
      <form
        onSubmit={handleSend}
        className="flex items-center p-2 relative w-full"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a comment..."
          className="bg-inherit text-white border-1 border-[#FFFFFF80] rounded-[8px] focus-visible:ring-0 focus-visible:ring-offset-0 pr-10 placeholder:font-[Inter]"
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="rounded-full bg-none text-primary absolute hover:bg-inherit hover:text-white right-4"
        >
          <Send className="w-7 h-7" />
        </Button>
      </form>
    </div>
  );
};

export default StreamChat;
