import { useEffect } from "react";
import { format } from "date-fns"; 
import EventTable from "./EventTable";
import { useEvents } from "../../context/EventContext";

const CurrentMonthEvents = () => {
  const { fetchEvents } = useEvents();

  useEffect(() => {
    // Get current month data on mount
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const currentMonthFilter = {
      dateRange: {
        startDate: format(firstDayOfMonth, "yyyy-MM-dd"),
        endDate: format(lastDayOfMonth, "yyyy-MM-dd")
      }
    };
    
    fetchEvents(currentMonthFilter);
  }, [fetchEvents]);

  // Skip initial fetch in EventTable since we're doing it here
  return <EventTable skipInitialFetch={true} />;
};

export default CurrentMonthEvents;