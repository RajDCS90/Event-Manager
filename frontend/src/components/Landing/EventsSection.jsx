import { Calendar } from "lucide-react";
import SectionHeader from "./SectionHeader";
import EventCard from "./EventCard";
import { useEvents } from "../../context/EventContext";
import { useEffect, useState } from "react";

export default function EventsSection({ setSelectedEvent }) {
  const { events, fetchEvents, loading: eventsLoading } = useEvents();
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);
  useEffect(()=>{
    console.log("events",events)
  },[events])

  useEffect(() => {
    if (events && events.length > 0) {
      const now = new Date();
      const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM

      const filtered = events
        .filter((event) => {
          const eventDate = event.eventDate?.split("T")[0]; // remove time if any
          const eventTime = event.startTime || "00:00";

          if (eventDate > currentDate) {
            return true; // future event
          } else if (eventDate === currentDate && eventTime > currentTime) {
            return true; // today but later than now
          }
          return false;
        })
        .sort((a, b) => {
          const dateTimeA = new Date(`${a.eventDate}T${a.startTime || "00:00"}`);
          const dateTimeB = new Date(`${b.eventDate}T${b.startTime || "00:00"}`);
          return dateTimeA - dateTimeB;
        })
        .slice(0, 3); // take first 3 upcoming events

      setUpcomingEvents(filtered);
    }
  }, [events]);

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeader
          icon={<Calendar size={20} className="text-white" />}
          title="Upcoming Events"
          bgColor="bg-orange-500"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {!eventsLoading && upcomingEvents?.length > 0 ? (
            upcomingEvents.map((item, index) => (
              <EventCard
                key={item._id || index}
                item={{
                  image:item.imageUrl || "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                  title: item.eventName,
                  date: new Date(item.eventDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                  time: `${item.startTime} - ${item.endTime}`,
                  location: item.venue,
                  motto: item.eventType,
                  description: item.eventDescription || "No description available",
                }}
                onClick={() => setSelectedEvent(item)}
              />
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-600">
              {eventsLoading ? "Loading events..." : "No upcoming events available."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
