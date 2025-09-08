import { useState } from "react";
import CarouselItem from "./carousel-item";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LiveImage1 from "../../../assets/images/wow-live-sample.jpg";
import LiveImage2 from "../../../assets/images/ufo2.jpg";
import LiveImage3 from "../../../assets/images/ufo3.jpg";
import { useSwipeable } from "react-swipeable";

const items = [
  {
    id: 1,
    image: LiveImage1,
    title: "Wade Fox",
    followers: "12.5k",
    live: "11.7k",
  },
  {
    id: 2,
    image: LiveImage2,
    title: "Quantum Void",
    followers: "8.1k",
    live: "9.2k",
  },
  {
    id: 3,
    image: LiveImage3,
    title: "Area 52",
    followers: "5.3k",
    live: "6.4k",
  },
];

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => {
    setActiveIndex((i) => (i === 0 ? items.length - 1 : i - 1));
  };

  const next = () => {
    setActiveIndex((i) => (i === items.length - 1 ? 0 : i + 1));
  };

  const handlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div
      {...handlers}
      className="relative flex items-center justify-center transition-transform duration-500 ease-in-out h-full mb-[500px]"
    >
      {items.map((item, index) => {
        const position = (index - activeIndex + items.length) % items.length;

        let style = "opacity-0 scale-75 translate-x-0 z-0";
        if (position === 0) {
          style = "opacity-100 scale-100 translate-x-0 z-20";
        } else if (position === 1) {
          style = "opacity-45 scale-80 translate-x-2/3 z-10";
        } else if (position === items.length - 1) {
          style = "opacity-45 scale-80 -translate-x-2/3 z-10";
        }

        return (
          <div
            key={item.id}
            className={cn(
              "absolute w-[45%] transition-all duration-500 ease-in-out top-10",
              style
            )}
          >
            <CarouselItem img={item.image} />
          </div>
        );
      })}

      <Button
        size="icon"
        onClick={prev}
        className="absolute z-50 text-white left-4 top-48"
      >
        <ChevronLeft />
      </Button>

      <Button
        size="icon"
        onClick={next}
        className="absolute z-50 text-white right-4 top-48"
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default Carousel;
