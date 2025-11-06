import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { userApi } from "@/firebase/user";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface UserFormData {
  firstName: string;
  lastName: string;
  displayName: string;
  bio: string;
  email: string;
  dateOfBirth: string;
  gender: "M" | "F" | "";
  photoURL: string;
  coverImageURL: string;
}

export default function Update() {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    displayName: "",
    bio: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    photoURL: "",
    coverImageURL: "",
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [initialLoading, setInitialLoading] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        const result = await userApi.get(user.id);
        if (result.success) {
          const userData = result.data as any;
          setFormData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            displayName: userData.displayName || "",
            bio: userData.bio || "",
            email: userData.email || "",
            dateOfBirth: userData.dateOfBirth || "",
            gender: userData.gender || "",
            photoURL: userData.photoURL || "",
            coverImageURL: userData.coverImageURL || "",
          });
          setImagePreview(userData.photoURL || "");
          setCoverImagePreview(userData.coverImageURL || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserData();
  }, [user?.uid]);

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("Please log in to update your profile");
      return;
    }

    setLoading(true);

    try {
      // Prepare files for upload
      const files: { profilePhoto?: File; coverImage?: File } = {};
      if (imageFile) files.profilePhoto = imageFile;
      if (coverImageFile) files.coverImage = coverImageFile;

      // Update user with files using userApi
      await userApi.updateWithFiles(user.id, formData, files);

      toast.success("Profile updated successfully!");
      navigate(`/user/${user.id}/profile`);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/user/${user?.id}/profile`);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Loading profile data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Update Profile</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="text-white hover:bg-gray-700"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Placeholder */}
          <div className="w-full h-32 bg-gray-600 rounded-lg relative overflow-hidden">
            {coverImagePreview ? (
              <img
                src={coverImagePreview}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-400">Cover Image</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white hover:bg-black/50"
            >
              <Camera className="h-5 w-5" />
            </Button>
          </div>

          {/* Profile Picture */}
          <div className="flex justify-center -mt-16 relative z-10">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-600 rounded-full overflow-hidden border-4 border-[#141414]">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -bottom-1 -right-1 bg-gray-700 hover:bg-gray-600 rounded-full p-2"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="bg-transparent border-gray-600 text-white"
                placeholder="Enter first name"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="bg-transparent border-gray-600 text-white"
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-white">Username </Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) => handleInputChange("displayName", e.target.value)}
              className="bg-transparent border-gray-600 text-white"
              placeholder="This will be your public channel name"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white">Bio</Label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="w-full min-h-[80px] bg-transparent border border-gray-600 rounded-md px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
              placeholder="Tell us about yourself"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-transparent border-gray-600 text-white"
              placeholder="Enter email address"
              disabled
            />
          </div>

          {/* Date of Birth and Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-white">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="bg-transparent border-gray-600 text-white [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label className="text-white">Gender</Label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="M"
                    checked={formData.gender === "M"}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="w-4 h-4 text-white bg-transparent border-gray-600 focus:ring-white"
                  />
                  <span className="text-white">M</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="F"
                    checked={formData.gender === "F"}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="w-4 h-4 text-white bg-transparent border-gray-600 focus:ring-white"
                  />
                  <span className="text-white">F</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="px-8 py-2 border-gray-600 text-black hover:bg-gray-700"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-8 py-2  hover:bg- text-white"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}