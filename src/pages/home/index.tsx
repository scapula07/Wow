import Carousel from "@/modules/home/components/carousel";
import LivestreamCategories from "@/modules/home/components/livestream-categories";
import LivestreamsForYou from "@/modules/home/components/livestreams-for-you";

const Home = () => {
  return (
    <div>
      <Carousel />
      <LivestreamCategories />
      <LivestreamsForYou />
    </div>
  );
};

export default Home;
