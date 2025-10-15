import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import CarouselItem from "./carousel-item";

const items = [
  {
    id: 1,
    image: "/assets/images/wow-live-sample.jpg",
    title: "Wade Fox",
    followers: "12.5k",
    live: "11.7k",
  },
  {
    id: 2,
    image: "/assets/images/ufo2.jpg",
    title: "Quantum Void",
    followers: "8.1k",
    live: "9.2k",
  },
  {
    id: 3,
    image: "/assets/images/ufo3.jpg",
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
      className="relative flex items-center justify-center h-[500px] overflow-hidden -mx-5"
    >
      {items.map((item, index) => {
        const position = (index - activeIndex + items.length) % items.length;

        let style =
          "opacity-0 scale-75 translate-x-0 z-0 transition-all duration-500 ease-in-out";
        if (position === 0) {
          style = "opacity-100 scale-100 translate-x-0 z-20";
        } else if (position === 1) {
          style =
            "opacity-30 scale-80 translate-x-1/2 sm:translate-x-2/3 z-10 blur-[1px]";
        } else if (position === items.length - 1) {
          style =
            "opacity-30 scale-80 -translate-x-1/2 sm:-translate-x-2/3 z-10 blur-[1px]";
        }

        return (
          <div
            key={item.id}
            className={cn(
              "absolute md:top-6 top-5 w-[90%] sm:w-[70%] md:w-[80%] lg:w-[45%]",
              "transition-all duration-500 ease-in-out",
              style
            )}
          >
            <CarouselItem img={item.image} />
          </div>
        );
      })}

      {/* Navigation buttons (hide on very small screens) */}
      <Button
        size="icon"
        onClick={prev}
        className="absolute z-20 hidden lg:flex left-4 top-48 text-white hover:bg-[#1f8b3a] transition md:w-10 md:h-10 w-8 h-8"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <Button
        size="icon"
        onClick={next}
        className="absolute z-20 hidden lg:flex right-4 top-48 text-white hover:bg-[#1f8b3a] transition md:w-10 md:h-10 w-8 h-8"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Carousel;
