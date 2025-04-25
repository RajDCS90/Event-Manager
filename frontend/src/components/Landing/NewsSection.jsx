import { CalendarDays, Download } from "lucide-react";
import SectionHeader from "./SectionHeader";
import NewsCard from "./NewsCard";
import { useEvents } from "../../context/EventContext";
import { useGrievance } from "../../context/GrievanceContext";
import { useEffect, useState } from "react";

export default function NewsSection() {
  const { events } = useEvents();
  const { grievances } = useGrievance();
  const [pastItems, setPastItems] = useState([]);

  useEffect(() => {
    console.log("All events:", events);
    console.log("All grievances:", grievances);
    
    if (events && grievances) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
      console.log("Current date for comparison:", currentDate);

      // Filter and map past events
      const pastEvents = events
        .filter(event => {
          const eventDate = new Date(event.eventDate);
          eventDate.setHours(0, 0, 0, 0);
          console.log(`Event: ${event.eventName}`, {
            date: eventDate,
            status: event.status,
            isPast: eventDate < currentDate,
            isCompleted: event.status === 'completed' || event.status === 'resolved'
          });
          return eventDate < currentDate && 
                 (event.status === 'completed' || event.status === 'resolved');
        })
        .map(event => ({
          image: event.imageUrl || 'https://via.placeholder.com/300', // Fallback image
          title: event.eventName,
          date: new Date(event.eventDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          type: 'Event'
        }));
      console.log("Filtered pastEvents:", pastEvents);

      // Filter and map past grievances
      const pastGrievances = grievances
        .filter(griev => {
          const grievDate = new Date(griev.programDate);
          grievDate.setHours(0, 0, 0, 0);
          console.log(`Grievance: ${griev.grievanceName}`, {
            date: grievDate,
            status: griev.status,
            isPast: grievDate < currentDate,
            isResolved: griev.status === 'completed' || griev.status === 'resolved'
          });
          return grievDate < currentDate && 
                 (griev.status === 'completed' || griev.status === 'resolved');
        })
        .map(griev => ({
          image: griev.imageUrl || 'https://via.placeholder.com/300', // Fallback image
          title: griev.grievanceName,
          date: new Date(griev.programDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          type: 'Grievance'
        }));
      console.log("Filtered pastGrievances:", pastGrievances);

      // Combine and sort by date (newest first)
      const combined = [...pastEvents, ...pastGrievances].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      setPastItems(combined);
      console.log("Final combined items:", combined);
    }
  }, [events, grievances]);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader 
          icon={<CalendarDays size={20} className="text-white" />} 
          title="Past Events & Grievances" 
          bgColor="bg-orange-500"
        />

        {pastItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastItems.map((item, index) => (
              <NewsCard key={index} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">No past events or grievances found</p>
        )}
      </div>
    </section>
  );
}