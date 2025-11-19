import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Avatar } from "@radix-ui/react-avatar";
import { Send } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type UIEvent,
} from "react";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  where 
} from "firebase/firestore";
import { db, auth } from "@/firebase/config";
import { onAuthStateChanged, type User } from "firebase/auth";
import { toast } from "sonner";

interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: any;
  streamId: string;
}

interface StreamChatProps {
  streamId?: string;
}

const StreamChat = ({ streamId }: StreamChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const chatRef = useRef<HTMLDivElement>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setShowOverlay(target.scrollTop > 0);
  };

  // Set up real-time message listener
  useEffect(() => {
    if (!streamId) {
      setLoading(false);
      return;
    }

    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("streamId", "==", streamId),
      orderBy("timestamp", "asc"),
      limit(100) // Limit to last 100 messages for performance
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages: Message[] = [];
      snapshot.forEach((doc) => {
        newMessages.push({
          id: doc.id,
          ...doc.data()
        } as Message);
      });
      setMessages(newMessages);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to messages:", error);
      toast.error("Failed to load chat messages");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [streamId]);

  // Send message
  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    if (!user) {
      toast.error("Please sign in to send messages");
      return;
    }

    if (!streamId) {
      toast.error("Stream not available");
      return;
    }

    setSending(true);

    try {
      const messageData = {
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || "Anonymous",
        userAvatar: user.photoURL || "",
        text: input.trim(),
        timestamp: serverTimestamp(),
        streamId: streamId
      };

      await addDoc(collection(db, "messages"), messageData);
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Format timestamp for display
  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return "";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // If less than 1 minute ago, show "just now"
    if (diff < 60000) {
      return "just now";
    }
    
    // If less than 1 hour ago, show minutes
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString();
  };

  if (!streamId) {
    return (
      <div className="flex flex-col rounded-lg h-full overflow-hidden">
        <div className="pt-3 px-3 font-semibold text-white">Live Chat</div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Chat not available</p>
        </div>
      </div>
    );
  }

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

        {loading && (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400">Loading chat...</p>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        )}

        {!loading && messages.length > 0 &&
          messages.map((msg) => (
            <div key={msg.id} className="flex items-start space-x-3 pt-4">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage
                  src={msg.userAvatar || `https://i.pravatar.cc/32?u=${msg.userId}`}
                  alt={msg.userName}
                  className="rounded-full"
                />
                <AvatarFallback className="text-xs">
                  {msg.userName?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1 min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-[#8D8A8AE5] truncate">
                    {msg.userName}
                  </p>
                  <span className="text-xs text-gray-500">
                    {formatMessageTime(msg.timestamp)}
                  </span>
                </div>
                <p className="text-white font-medium break-words">{msg.text}</p>
              </div>
            </div>
          ))}
      </div>

      {/* Input box */}
      <form
        onSubmit={handleSend}
        className="flex items-center p-2 relative w-full"
      >
 

      </form>
      
      {!user && (
        <div className="px-3 pb-2">
          <p className="text-xs text-gray-400 text-center">
            Please sign in to participate in the chat
          </p>
        </div>
      )}
    </div>
  );
};

export default StreamChat;
