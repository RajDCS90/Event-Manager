import { MessageSquare, UserPlus, Share2 } from "lucide-react";
import SectionHeader from "./SectionHeader";
import GrievanceCard from "./GrievanceCard";

export default function GrievancesSection() {
  const grievanceItems = [
    {
      image:
        "https://images.pexels.com/photos/30169489/pexels-photo-30169489/free-photo-of-colorful-indian-celebration-with-joyful-guests.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Public Grievance Redressal Camp",
      date: "April 18, 2025",
      location: "Community Center",
    },
    {
      image:
        "https://images.pexels.com/photos/15835314/pexels-photo-15835314/free-photo-of-colorful-powder-over-people-at-festival.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Online Grievance Registration Workshop",
      date: "April 22, 2025",
      location: "Digital Village Center",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader 
          icon={<MessageSquare size={20} className="text-white" />} 
          title="Grievance Redressal" 
          bgColor="bg-red-500"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {grievanceItems.map((item, index) => (
            <GrievanceCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}