import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";

// Import components
import { useEvents } from "../../context/EventContext";
import { useGrievance } from "../../context/GrievanceContext";
import CustomCalendar from "./CustomCalendar";
import EventCard from "./EventCard";
import MonthOverview from "./MonthOverview";
import GrievanceCard from "./GrievanceCard";
import { formatDate, getDateDetails } from "../utils/dateUtils";
import GrievanceTable from "../Grievance/GrievanceTable";
import EventTable from "../Event/EventTable";

export default function EventsAndGrievancesPage() {
  const { events, fetchEvents, loading: eventsLoading } = useEvents();
  const {
    grievances,
    fetchGrievances,
    loading: grievancesLoading,
  } = useGrievance();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'events', 'grievances'
  const [showEventTables, setShowEventTables] = useState(false);
  const [showGrevianceTables, setShowGravianceTables] = useState(false);
  const tablesRef = useRef(null);

  // In EventsAndGrievancesPage component
  const scrollToTables = () => {
    tablesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start", // You can adjust this to 'center' or 'end' if needed
    });
  };

  useEffect(() => {
    fetchEvents();
    fetchGrievances();
  }, []);
  useEffect(()=>{
    console.log("grievances",grievances)
  },[grievances])

  // Filter items for selected date
  const filteredEvents = events.filter(
    (event) =>
      formatDate(new Date(event.eventDate)) === formatDate(selectedDate)
  );

  const filteredGrievances = grievances.filter(
    (grievance) =>
      formatDate(new Date(grievance.programDate)) === formatDate(selectedDate)
  );

  // Combined list for "All" tab
  const combinedItems = [
    ...filteredEvents.map((e) => ({ ...e, type: "event" })),
    ...filteredGrievances.map((g) => ({ ...g, type: "grievance" })),
  ];

  // Sort by start time
  combinedItems.sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  // Items to show based on active tab
  const getItemsToShow = () => {
    switch (activeTab) {
      case "events":
        return filteredEvents.map((event) => (
          <EventCard key={event._id} event={event} />
        ));
      case "grievances":
        return filteredGrievances.map((grievance) => (
          <GrievanceCard key={grievance._id} grievance={grievance} />
        ));
      default:
        return combinedItems.map((item) =>
          item.type === "event" ? (
            <EventCard key={item._id} event={item} />
          ) : (
            <GrievanceCard key={item._id} grievance={item} />
          )
        );
    }
  };

  // Date details for selected date
  const { day, month, year } = getDateDetails(selectedDate);

  // Loading state
  const isLoading = eventsLoading || grievancesLoading;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Events & Grievances Dashboard
          </h1>
          <p className="text-gray-600">
            Manage all your events and grievances in one place
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar */}
        <div className="space-y-6">
          {/* Calendar */}
          <CustomCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            events={events}
            grievances={grievances}
          />

          {/* Month overview */}
          <MonthOverview
            events={events}
            grievances={grievances}
            currentMonth={selectedDate}
            setShowEventTables={setShowEventTables}
            setShowGravianceTables={setShowGravianceTables}
            scrollToTables={scrollToTables}
          />
        </div>

        {/* Main content area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Selected date header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">{day}</h2>
                  <p className="text-blue-100">
                    {month} {year}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setDate(newDate.getDate() - 1);
                      setSelectedDate(newDate);
                    }}
                    className="p-1 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setDate(newDate.getDate() + 1);
                      setSelectedDate(newDate);
                    }}
                    className="p-1 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex space-x-1 bg-blue-800 bg-opacity-30 rounded-lg p-1 w-fit">
                  <button
                    className={`px-4 py-1 rounded-md transition-colors ${
                      activeTab === "all"
                        ? "bg-white text-blue-700"
                        : "text-white"
                    }`}
                    onClick={() => setActiveTab("all")}
                  >
                    All ({combinedItems.length})
                  </button>
                  <button
                    className={`px-4 py-1 rounded-md transition-colors ${
                      activeTab === "events"
                        ? "bg-white text-blue-700"
                        : "text-white"
                    }`}
                    onClick={() => setActiveTab("events")}
                  >
                    Events ({filteredEvents.length})
                  </button>
                  <button
                    className={`px-4 py-1 rounded-md transition-colors ${
                      activeTab === "grievances"
                        ? "bg-white text-blue-700"
                        : "text-white"
                    }`}
                    onClick={() => setActiveTab("grievances")}
                  >
                    Grievances ({filteredGrievances.length})
                  </button>
                </div>
              </div>
            </div>

            {/* Items list */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : getItemsToShow().length > 0 ? (
                <div className="space-y-4">{getItemsToShow()}</div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <CalendarIcon
                    size={48}
                    className="mx-auto text-gray-400 mb-4"
                  />
                  <p className="text-lg">No items for this date</p>
                  <p className="text-sm">
                    Select another date or add a new item
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 w-full mt-10" ref={tablesRef}>
        {showGrevianceTables && (
          <div className="w-full">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
              </div>
            ) : (
              <GrievanceTable skipInitialFetch={true}/>
            )}
          </div>
        )}
        {showEventTables && (
          <div className="w-full">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <EventTable skipInitialFetch={true} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
