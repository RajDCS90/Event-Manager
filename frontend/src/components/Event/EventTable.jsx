import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { useEvents } from "../../context/EventContext";
import { useAuth } from "../../context/AuthContext";
import {
  Edit,
  Trash,
  Calendar,
  Clock,
  MapPin,
  User,
  Filter,
  X,
} from "lucide-react";
import StatusBadge from "../common/StatusBadge";

const EventTable = () => {
  const { events, loading, error, updateEvent, deleteEvent, fetchEvents } =
    useEvents();
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
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

  useEffect(() => {
    // Initial fetch with no filters
    fetchEvents();
  }, []);

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "PP");
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? "PM" : "AM";
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const handleEditClick = (event) => {
    setEditingId(event._id);
    setEditForm({
      eventName: event.eventName,
      eventType: event.eventType,
      venue: event.venue,
      eventDate: event.eventDate,
      startTime: event.startTime,
      endTime: event.endTime,
      status: event.status,
      mandal: event.mandal,
      requesterName: event.requesterName,
      requesterContact: event.requesterContact,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async () => {
    try {
      // Validate time fields
      if (
        !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(editForm.startTime) ||
        !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(editForm.endTime)
      ) {
        throw new Error("Please enter time in HH:MM format (24-hour)");
      }

      if (editForm.startTime >= editForm.endTime) {
        throw new Error("End time must be after start time");
      }

      const updatedEvent = {
        _id: editingId,
        ...editForm,
        updatedAt: new Date().toISOString(),
      };

      await updateEvent(updatedEvent);
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error("Error updating event:", error);
      alert(error.message || "Failed to update event");
    }
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const eventToUpdate = events.find((e) => e._id === id);
      if (!eventToUpdate) return;

      const updatedEvent = {
        ...eventToUpdate,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      await updateEvent(updatedEvent);
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.message || "Failed to update status");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === "") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(
        events.filter(
          (event) =>
            event.eventName.toLowerCase().includes(term) ||
            event.venue.toLowerCase().includes(term) ||
            event.requesterName.toLowerCase().includes(term) ||
            event.mandal.toLowerCase().includes(term)
        )
      );
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

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

      // Handle date range
      if (filters.dateRange.eventDate) {
        apiFilters.eventDate = filters.dateRange.eventDate;
      }

      // Address filters
      if (filters.village) apiFilters.village = filters.village;
      if (filters.postOffice) apiFilters.postOffice = filters.postOffice;
      if (filters.policeStation)
        apiFilters.policeStation = filters.policeStation;
      if (filters.pincode) apiFilters.pincode = filters.pincode;

      // Fetch events with filters
      await fetchEvents(apiFilters);

      // Reset search term when applying filters
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

    // Only call fetchEvents if filters are not already empty
    const isFiltersEmpty =
      JSON.stringify(filters) === JSON.stringify(defaultFilters);

    setFilters(defaultFilters);
    setSearchTerm("");

    if (!isFiltersEmpty) {
      await fetchEvents();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            Event Management
          </h2>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
            >
              <Filter size={16} className="mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Filter Events</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                name="eventType"
                value={filters.eventType}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="political">Political</option>
                <option value="social">Social</option>
                <option value="commercial">Commercial</option>
                <option value="welfare">Welfare</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mandal
              </label>
              <input
                type="text"
                name="mandal"
                value={filters.mandal}
                onChange={handleFilterChange}
                placeholder="Enter mandal"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue
              </label>
              <input
                type="text"
                name="venue"
                value={filters.venue}
                onChange={handleFilterChange}
                placeholder="Enter venue"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <input
                type="date"
                name="dateRange.eventDate"
                value={filters.dateRange.eventDate}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <h4 className="text-md font-medium text-gray-700 mb-2">
              Address Filters
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Village
                </label>
                <input
                  type="text"
                  name="village"
                  value={filters.village}
                  onChange={handleFilterChange}
                  placeholder="Enter village"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Post Office
                </label>
                <input
                  type="text"
                  name="postOffice"
                  value={filters.postOffice}
                  onChange={handleFilterChange}
                  placeholder="Enter post office"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Police Station
                </label>
                <input
                  type="text"
                  name="policeStation"
                  value={filters.policeStation}
                  onChange={handleFilterChange}
                  placeholder="Enter police station"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={filters.pincode}
                  onChange={handleFilterChange}
                  placeholder="Enter pincode"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-gray-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p>Loading events...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Event Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Venue
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date & Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Requester
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No events found
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === event._id ? (
                        <input
                          type="text"
                          name="eventName"
                          value={editForm.eventName}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="font-medium text-gray-900">
                          {event.eventName}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === event._id ? (
                        <select
                          name="eventType"
                          value={editForm.eventType}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        >
                          <option value="political">Political</option>
                          <option value="social">Social</option>
                          <option value="commercial">Commercial</option>
                          <option value="welfare">Welfare</option>
                        </select>
                      ) : (
                        <span className="capitalize">{event.eventType}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === event._id ? (
                        <input
                          type="text"
                          name="venue"
                          value={editForm.venue}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="flex items-center">
                          <MapPin className="mr-1 text-gray-400" />
                          {event.venue}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === event._id ? (
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Calendar className="mr-2 text-gray-400" />
                            <input
                              type="date"
                              name="eventDate"
                              value={editForm.eventDate}
                              onChange={handleInputChange}
                              className="border border-gray-300 rounded px-2 py-1"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <Clock className="mr-2 text-gray-400" />
                              <input
                                type="time"
                                name="startTime"
                                value={editForm.startTime}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded px-2 py-1"
                              />
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-2 text-gray-400" />
                              <input
                                type="time"
                                name="endTime"
                                value={editForm.endTime}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded px-2 py-1"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div>{formatDate(event.eventDate)}</div>
                          <div className="text-sm text-gray-500">
                            {formatTime(event.startTime)} -{" "}
                            {formatTime(event.endTime)}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === event._id ? (
                        <select
                          name="status"
                          value={editForm.status}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <StatusBadge status={event.status} />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === event._id ? (
                        <input
                          type="text"
                          name="requesterName"
                          value={editForm.requesterName}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="flex items-center">
                          <User className="mr-1 text-gray-400" />
                          {event.requesterName}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                      {editingId === event._id ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            className="text-blue-600 hover:text-blue-900 mr-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditClick(event)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(event._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventTable;
