import LivestreamCard from "@/components/livestream-card";

const ProfileVideoTab = () => {
  return (
    <div className="grid md:grid-cols-4 grid-cols-1 gap-x-5 gap-y-8 mb-6">
      {[...Array(9)].map((_, i) => (
        <LivestreamCard key={i} video />
      ))}
    </div>
  );
};

export default ProfileVideoTab;
