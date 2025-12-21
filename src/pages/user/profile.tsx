import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc, onSnapshot, increment, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getUserCensoredStreams, getStreamBlockReasons, type CensoredStreamInfo } from "@/firebase/censorship";
import { CensorshipNotice } from "@/components/censorship-notice";

import ProfileLivestreamTab from "@/modules/user/components/profile-livestream-tab";

const sampleText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.";

interface UserData {
  id: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  coverImageURL?: string;
  bio?: string;
  followerCount?: number;
  followingCount?: number;
  createdAt: string;
}

const Profile = () => {
  const [expandText, setExpandText] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [censoredStreams, setCensoredStreams] = useState<CensoredStreamInfo[]>([]);
  const [loadingCensorship, setLoadingCensorship] = useState(true);

  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Fetch user data when component mounts or id changes
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        setError("User ID not provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const userDoc = await getDoc(doc(db, "users", id));
        
        if (userDoc.exists()) {
          const userData = {
            id: userDoc.id,
            ...userDoc.data()
          } as UserData;
          setUser(userData);
          setFollowerCount(userData.followerCount || 0);
        } else {
          setError("User not found");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Check if current user is following this profile user
  useEffect(() => {
    if (!currentUser?.id || !id || currentUser.id === id) return;

    const followDocRef = doc(db, "follows", `${currentUser.id}_${id}`);
    
    const unsubscribe = onSnapshot(followDocRef, (doc) => {
      setIsFollowing(doc.exists());
    });

    return () => unsubscribe();
  }, [currentUser?.id, id]);

  // Listen to real-time follower count changes
  useEffect(() => {
    if (!id) return;

    const userDocRef = doc(db, "users", id);
    
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setFollowerCount(userData.followerCount || 0);
      }
    });

    return () => unsubscribe();
  }, [id]);

  // Fetch censored streams for this user
  useEffect(() => {
    const fetchCensoredStreams = async () => {
      if (!id) {
        setLoadingCensorship(false);
        return;
      }

      setLoadingCensorship(true);
      try {
        const censored = await getUserCensoredStreams(id);
        
        // Fetch reasons for each censored stream
        const streamsWithReasons = await Promise.all(
          censored.map(async (stream) => {
            const reasons = await getStreamBlockReasons(stream.streamId);
            return { ...stream, reasons };
          })
        );

        setCensoredStreams(streamsWithReasons);
      } catch (error) {
        console.error("Error fetching censored streams:", error);
      } finally {
        setLoadingCensorship(false);
      }
    };

    fetchCensoredStreams();
  }, [id]);

  // Get display name with fallback logic
  const getDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`;
    if (user?.firstName) return user.firstName;
    if (user?.email) return user.email.split('@')[0];
    return "Unknown User";
  };

  // Handle follow/unfollow action
  const handleFollowToggle = async () => {
    if (!currentUser?.id || !id || currentUser.id === id) {
      toast.error("Please log in to follow users");
      return;
    }

    setFollowLoading(true);

    try {
      const followDocRef = doc(db, "follows", `${currentUser.id}_${id}`);
      const userDocRef = doc(db, "users", id);
      const currentUserDocRef = doc(db, "users", currentUser.id);

      if (isFollowing) {
        // Unfollow: Delete follow document and decrement counts
        await deleteDoc(followDocRef);
        await updateDoc(userDocRef, {
          followerCount: increment(-1)
        });
        await updateDoc(currentUserDocRef, {
          followingCount: increment(-1)
        });
        toast.success(`Unfollowed ${getDisplayName()}`);
      } else {
        // Follow: Create follow document and increment counts
        await setDoc(followDocRef, {
          followerId: currentUser.id,
          followingId: id,
          createdAt: new Date().toISOString()
        });
        await updateDoc(userDocRef, {
          followerCount: increment(1)
        });
        await updateDoc(currentUserDocRef, {
          followingCount: increment(1)
        });
        toast.success(`Now following ${getDisplayName()}`);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error("Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  // Check if this is the current user's own profile
  const isOwnProfile = currentUser?.id === id;

  // Loading state
  if (loading) {
    return (
      <div className="mt-12 flex items-center justify-center py-20">
        <div className="text-white text-lg">Loading user profile...</div>
      </div>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center py-20 space-y-4">
        <div className="text-red-400 text-lg">{error || "User not found"}</div>
        <Button 
          onClick={() => window.history.back()} 
          variant="outline"
          className="text-white border-gray-600 hover:bg-gray-800"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div id={id} className="mt-6 sm:mt-12 flex flex-col space-y-6 sm:space-y-10 px-2 sm:px-4 md:px-0">
      {/* Cover Image Section */}
      {user.coverImageURL && (
        <div className="w-full h-32 sm:h-48 rounded-lg overflow-hidden relative">
          <img
            src={user.coverImageURL}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-7">
        <img
          src={user.photoURL || "/assets/images/wow-live-sample.jpg"}
          alt="profile-pics"
          className="w-full sm:w-1/3 md:w-1/4 h-[200px] sm:h-[250px] max-h-[250px] rounded-[10px] object-cover shadow transition-all duration-500 ease-in-out"
        />

        <div className="flex flex-col space-y-3 sm:space-y-5 w-full sm:max-w-[61%]">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-[40px] leading-tight sm:leading-12">
            {getDisplayName()}
          </h1>

          <p className="text-base sm:text-xl md:text-2xl font-medium">
            147k <span className="text-[#FFFFFFB2]">viewers</span>{" "}
            <span className="text-xs mx-1 relative bottom-0.5">●</span>{" "}
            {followerCount.toLocaleString()}{" "}
            <span className="text-[#FFFFFFB2]">followers</span>
          </p>

          <div
            className="font-medium text-sm sm:text-base !transition-all !duration-500 !ease-in-out overflow-hidden"
            style={{
              maxHeight: expandText ? "500px" : "50px",
            }}
          >
            {expandText
              ? (user.bio || sampleText)
              : (user.bio || sampleText).slice(0, 200) +
                `${(user.bio || sampleText).length > 200 ? "..." : ""}`}
            <button
              className="bg-none w-fit h-0 relative bottom-4 cursor-pointer inline"
              onClick={() => setExpandText(!expandText)}
            >
              <ChevronDown
                style={{
                  transform: expandText ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "all 0.2s ease-in-out",
                }}
              />
            </button>
          </div>

          {!isOwnProfile && currentUser && (
            <Button 
              className={`font-semibold w-full sm:w-fit px-8 sm:px-12 mt-3 rounded-[5px] text-sm sm:text-base ${
                isFollowing 
                  ? "bg-gray-600 text-white hover:bg-gray-700" 
                  : "text-[#141414]"
              }`}
              onClick={handleFollowToggle}
              disabled={followLoading}
            >
              {followLoading 
                ? "Loading..." 
                : isFollowing 
                  ? "Unfollow" 
                  : "Follow"
              }
            </Button>
          )}

          {!isOwnProfile && !currentUser && (
            <Button 
              className="text-[#141414] font-semibold w-full sm:w-fit px-8 sm:px-12 mt-3 rounded-[5px] text-sm sm:text-base"
              onClick={() => toast.error("Please log in to follow users")}
            >
              Follow
            </Button>
          )}

          {isOwnProfile && (
            <Button 
              className="text-[#141414] font-semibold w-full sm:w-fit px-8 sm:px-12 mt-3 rounded-[5px] text-sm sm:text-base"
              onClick={() => navigate(`/user/${id}/update`)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Censorship Notice */}
      {!loadingCensorship && censoredStreams.length > 0 && (
        <CensorshipNotice censoredStreams={censoredStreams} />
      )}

      <Tabs className="w-full" defaultValue="livestreams">
        <TabsList className="w-full sm:w-fit bg-inherit items-center text-white h-fit mb-5">
          {["livestreams", "videos"].map((tab, index) => (
            <TabsTrigger
              key={index}
              value={tab}
              className="data-[state=active]:bg-primary bg-[#141414] rounded-[5px] h-10 flex-1 sm:flex-none sm:px-20 cursor-pointer text-white capitalize text-sm sm:text-base"
              onClick={() => {
                if (tab === "videos") {
                  toast.info("Video feature coming soon!");
                }
              }}
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="livestreams">
          <ProfileLivestreamTab />
        </TabsContent>

        <TabsContent value="videos">
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400 text-lg">Video feature coming soon!</div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
