import { useEffect, useState } from "react";
import { useEvents } from "../../context/EventContext";
import EventTableHeader from "./EventTableHeader";
import EventFilters from "./EventFilters";
import EventList from "./EventList";
import UpdateEventModal from "./UpdateEventModal";
import ErrorMessage from "../common/ErrorMessage";
import LoadingSpinner from "../common/LoadingSpinner";

const EventTable = ({ skipInitialFetch = false }) => {
  const { events, loading, error, deleteEvent, fetchEvents } = useEvents();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filters, setFilters] = useState({
    eventType: "",
    status: "",
    mandal: "",
    venue: "",
    dateRange: {
      eventDate: "",
    },
    village: "",
    postOffice: "",
    policeStation: "",
    pincode: "",
  });

  // Initial fetch - now with skipInitialFetch option
  useEffect(() => {
    if (!skipInitialFetch) {
      fetchEvents();
    }
  }, [skipInitialFetch, fetchEvents]);

  // Update filtered events when events change
  useEffect(() => {
    applySearchFilter(events, searchTerm);
  }, [events]);

  const applySearchFilter = (eventsArray, term) => {
    if (!term) {
      setFilteredEvents(eventsArray);
      return;
    }
    
    const lowercaseTerm = term.toLowerCase();
    setFilteredEvents(
      eventsArray.filter(
        (event) =>
          event.eventName.toLowerCase().includes(lowercaseTerm) ||
          event.venue.toLowerCase().includes(lowercaseTerm) ||
          event.requesterName.toLowerCase().includes(lowercaseTerm) ||
          event.mandal.toLowerCase().includes(lowercaseTerm)
      )
    );
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    applySearchFilter(events, term);
  };

  const handleFilterChange = (name, value) => {
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFilters((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const applyFilters = async () => {
    try {
      // Prepare filter object for API
      const apiFilters = {};

      if (filters.eventType) apiFilters.eventType = filters.eventType;
      if (filters.status) apiFilters.status = filters.status;
      if (filters.mandal) apiFilters.mandal = filters.mandal;
      if (filters.venue) apiFilters.venue = filters.venue;
      if (filters.dateRange.eventDate) apiFilters.eventDate = filters.dateRange.eventDate;
      if (filters.village) apiFilters.village = filters.village;
      if (filters.postOffice) apiFilters.postOffice = filters.postOffice;
      if (filters.policeStation) apiFilters.policeStation = filters.policeStation;
      if (filters.pincode) apiFilters.pincode = filters.pincode;

      await fetchEvents(apiFilters);
      setSearchTerm("");
    } catch (error) {
      console.error("Error applying filters:", error);
      alert("Failed to apply filters. Please try again.");
    }
  };

  const resetFilters = async () => {
    setShowFilters(false);

    const defaultFilters = {
      eventType: "",
      status: "",
      mandal: "",
      venue: "",
      dateRange: {
        eventDate: "",
      },
      village: "",
      postOffice: "",
      policeStation: "",
      pincode: "",
    };

    const isFiltersEmpty = JSON.stringify(filters) === JSON.stringify(defaultFilters);
    
    setFilters(defaultFilters);
    setSearchTerm("");

    if (!isFiltersEmpty) {
      await fetchEvents();
    }
  };

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setShowUpdateModal(true);
  };

  const handleUpdateModalClose = () => {
    setShowUpdateModal(false);
    setSelectedEvent(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id);
      } catch (error) {
        console.error("Error deleting event:", error);
        alert(error.message || "Failed to delete event");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <EventTableHeader 
        searchTerm={searchTerm}
        onSearch={handleSearch}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {showFilters && (
        <EventFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={applyFilters}
          onResetFilters={resetFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner message="Loading events..." />
      ) : (
        <EventList
          events={filteredEvents}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      )}

      {showUpdateModal && (
        <UpdateEventModal
          event={selectedEvent}
          onClose={handleUpdateModalClose}
        />
      )}
    </div>
  );
};

export default EventTable;