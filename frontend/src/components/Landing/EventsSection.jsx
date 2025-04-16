import { Calendar } from "lucide-react";
import SectionHeader from "./SectionHeader";
import EventCard from "./EventCard";

export default function EventsSection({ setSelectedEvent }) {
  const eventItems = [
    {
      image:
        "https://images.pexels.com/photos/8819344/pexels-photo-8819344.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Public Meeting at Town Hall",
      date: "April 16, 2025",
      time: "10:00 AM - 1:00 PM",
      location: "Central Town Hall, Main Street",
      chiefGuest: "Hon. Minister of Rural Development",
      motto: "Empowering Communities Through Direct Dialogue",
      description:
        "Join us for an interactive session where citizens can directly address their concerns with local leadership. This public meeting aims to bridge the gap between government initiatives and public needs.",
      highlights: [
        "Direct interaction with elected representatives",
        "On-spot grievance resolution",
        "Discussion on upcoming development projects",
        "Community feedback session",
      ],
      agenda: [
        {
          time: "10:00 AM",
          activity: "Welcome Address",
          description: "By the District Collector",
        },
        {
          time: "10:15 AM",
          activity: "Keynote Speech",
          description: "By the Chief Guest",
        },
        {
          time: "11:00 AM",
          activity: "Open Forum",
          description: "Public interaction and Q&A",
        },
        {
          time: "12:30 PM",
          activity: "Vote of Thanks",
          description: "Closing remarks",
        },
      ],
      gallery: [
        "https://images.pexels.com/photos/400400/pexels-photo-400400.jpeg",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        "https://img.freepik.com/free-photo/abstract-background_23-2148810111.jpg",
        "https://images.pexels.com/photos/400400/pexels-photo-400400.jpeg",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        "https://img.freepik.com/free-photo/abstract-background_23-2148810111.jpg",
      ],
    },
    {
      image:
        "https://images.pexels.com/photos/19360699/pexels-photo-19360699/free-photo-of-colorful-powder-over-people-in-festival-in-india.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Youth Empowerment Summit",
      date: "April 20, 2025",
      location: "District Sports Complex",
    },
    {
      image:
        "https://images.pexels.com/photos/9392445/pexels-photo-9392445.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Rural Development Conference",
      date: "April 25, 2025",
      location: "Gram Panchayat Bhavan",
    },
  ];

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeader 
          icon={<Calendar size={20} className="text-white" />} 
          title="Upcoming Events" 
          bgColor="bg-orange-500"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {eventItems.map((item, index) => (
            <EventCard 
              key={index} 
              item={item} 
              onClick={() => setSelectedEvent(eventItems[index])} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
