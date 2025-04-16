import { Download, Facebook, Twitter, Share2 } from "lucide-react";
import SectionHeader from "./SectionHeader";
import NewsCard from "./NewsCard"

export default function NewsSection() {
  const newsItems = [
    {
      image:
        "https://images.pexels.com/photos/2802809/pexels-photo-2802809.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Addressing gathering at Anandpur Dham, Madhya Pradesh",
      date: "April 12, 2025",
    },
    {
      image:
        "https://images.pexels.com/photos/16225733/pexels-photo-16225733/free-photo-of-a-group-of-children-sitting-on-a-bench.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Mann Ki Baat: Share your ideas and suggestions now!",
      date: "April 10, 2025",
    },
    {
      image:
        "https://images.pexels.com/photos/7580812/pexels-photo-7580812.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Prime Minister receives the Crown Prince of Dubai",
      date: "April 8, 2025",
    },
    {
      image:
        "https://images.pexels.com/photos/8819344/pexels-photo-8819344.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Social Media Corner 13th April 2025",
      date: "April 13, 2025",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader 
          icon={<Download size={20} className="text-white" />} 
          title="More News" 
          bgColor="bg-teal-500"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsItems.map((item, index) => (
            <NewsCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}