import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/corousel1.jpg",
      title: "Let's Script the Rise of a New India Together",
      description: "MLA visit to various development projects across the region.",
    },
    {
      image: "/corousel2.jpg",
      title: "Building a Stronger Nation",
      description: "Inspiring communities to come together for a brighter future.",
    },
    {
      image: "/corousel3.jpg",
      title: "Progress for All",
      description: "Showcasing the impact of government initiatives for the people.",
    },
    {
      image: "/corousel4.jpg",
      title: "Progress is destiny",
      description: "Showcasing the impact of government initiatives for the people.",
    },
    {
      image: "/corousel5.jpg",
      title: "Fierceful Speech ",
      description: "Showcasing rally organised by our party",
    },
    {
      image: "/corousel6.jpg",
      title: "Unity is Diversity",
      description: "Showcasing the people's love.",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden h-96 bg-orange-500">
      <div
        className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full relative group">
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="w-[60%] h-[100%] object-cover mx-auto transition-transform duration-500 group-hover:scale-110"
            />
            {/* Dark overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 transition-all duration-300 hover:scale-110 z-10"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 transition-all duration-300 hover:scale-110 z-10"
      >
        <ChevronRight size={24} className="text-white" />
      </button>

      {/* Bottom content container with semi-transparent background */}
      <div className="absolute bottom-0 left-0 right-0 pb-4 bg-gradient-to-t from-black/70 to-transparent pt-8">
        {/* Text content with improved visibility */}
        <div className="text-center mb-2 px-4">
          <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
            {slides[currentSlide].title}
          </h2>
          <p className="text-white text-sm md:text-base drop-shadow-md">
            {slides[currentSlide].description}
          </p>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                currentSlide === index ? "bg-white" : "bg-white/50"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}