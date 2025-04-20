
import { useState, useEffect } from "react"
import { useEvents } from "../context/EventContext"
import { useGrievance } from "../context/GrievanceContext"
import { Calendar, ChevronLeft, ChevronRight, X, Clock, MapPin, AlertCircle, CalendarIcon } from "lucide-react"

// Helper to format date as YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split("T")[0]
}

// Helper to get day, month, year from date
const getDateDetails = (date) => {
  const day = date.getDate()
  const month = date.toLocaleString("default", { month: "long" })
  const year = date.getFullYear()
  return { day, month, year }
}

// Badge component for status
const StatusBadge = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeStyle()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
    </span>
  )
}

// Event item component for calendar cell
const EventItem = ({ event }) => {
  return (
    <div className="text-xs p-1 mb-1 bg-blue-50 rounded border-l-2 border-blue-500 truncate">
      <div className="font-medium text-blue-700 truncate">{event.eventName}</div>
      <div className="text-gray-500 flex items-center">
        <Clock size={10} className="mr-1" />
        {event.startTime}
      </div>
    </div>
  )
}

// Grievance item component for calendar cell
const GrievanceItem = ({ grievance }) => {
  return (
    <div className="text-xs p-1 mb-1 bg-red-50 rounded border-l-2 border-red-500 truncate">
      <div className="font-medium text-red-700 truncate">{grievance.grievanceName}</div>
      <div className="text-gray-500 flex items-center">
        <Clock size={10} className="mr-1" />
        {grievance.startTime}
      </div>
    </div>
  )
}

// Event card component for modal
const EventCard = ({ event }) => {
  const { eventName, eventType, venue, status, eventDate, startTime, endTime } = event
  const formattedDate = new Date(eventDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300 animate-fadeIn">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg text-gray-800">{eventName}</h3>
        <StatusBadge status={status} />
      </div>
      <div className="mt-2 text-sm text-gray-600">
        <div className="flex items-center mb-1">
          <Calendar size={16} className="mr-2 text-gray-500" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center mb-1">
          <Clock size={16} className="mr-2 text-gray-500" />
          <span>
            {startTime} - {endTime}
          </span>
        </div>
        <div className="flex items-center mb-1">
          <MapPin size={16} className="mr-2 text-gray-500" />
          <span>{venue}</span>
        </div>
      </div>
      <div className="mt-3 flex justify-between items-center">
        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">{eventType}</span>
      </div>
    </div>
  )
}

// Grievance card component for modal
const GrievanceCard = ({ grievance }) => {
  const { grievanceName, type, applicant, status, programDate, startTime, endTime } = grievance
  const formattedDate = new Date(programDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3 border-l-4 border-red-500 hover:shadow-lg transition-shadow duration-300 animate-fadeIn">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg text-gray-800">{grievanceName}</h3>
        <StatusBadge status={status} />
      </div>
      <div className="mt-2 text-sm text-gray-600">
        <div className="flex items-center mb-1">
          <CalendarIcon size={16} className="mr-2 text-gray-500" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center mb-1">
          <Clock size={16} className="mr-2 text-gray-500" />
          <span>
            {startTime} - {endTime}
          </span>
        </div>
        <div className="flex items-center mb-1">
          <AlertCircle size={16} className="mr-2 text-gray-500" />
          <span>Applicant: {applicant}</span>
        </div>
      </div>
      <div className="mt-3 flex justify-between items-center">
        <span className="bg-red-50 text-red-700 px-2 py-1 rounded-md text-xs font-medium">{type}</span>
      </div>
    </div>
  )
}

// Modal component for detailed view
const DetailModal = ({ isOpen, onClose, selectedDate, events, grievances }) => {
  const [activeTab, setActiveTab] = useState("all")

  if (!isOpen) return null

  const { day, month, year } = getDateDetails(selectedDate)

  // Combined list for "All" tab
  const combinedItems = [
    ...events.map((e) => ({ ...e, type: "event" })),
    ...grievances.map((g) => ({ ...g, type: "grievance" })),
  ]

  // Sort by start time
  combinedItems.sort((a, b) => {
    return a.startTime.localeCompare(b.startTime)
  })

  // Items to show based on active tab
  const getItemsToShow = () => {
    switch (activeTab) {
      case "events":
        return events.map((event) => <EventCard key={event._id} event={event} />)
      case "grievances":
        return grievances.map((grievance) => <GrievanceCard key={grievance._id} grievance={grievance} />)
      default:
        return combinedItems.map((item) =>
          item.type === "event" ? (
            <EventCard key={item._id} event={item} />
          ) : (
            <GrievanceCard key={item._id} grievance={item} />
          ),
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">{day}</h2>
              <p className="text-blue-100">
                {month} {year}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-blue-700 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-4">
            <div className="flex space-x-1 bg-blue-800 bg-opacity-30 rounded-lg p-1 w-fit">
              <button
                className={`px-4 py-1 rounded-md transition-colors ${activeTab === "all" ? "bg-white text-blue-700" : "text-white"}`}
                onClick={() => setActiveTab("all")}
              >
                All ({combinedItems.length})
              </button>
              <button
                className={`px-4 py-1 rounded-md transition-colors ${activeTab === "events" ? "bg-white text-blue-700" : "text-white"}`}
                onClick={() => setActiveTab("events")}
              >
                Events ({events.length})
              </button>
              <button
                className={`px-4 py-1 rounded-md transition-colors ${activeTab === "grievances" ? "bg-white text-blue-700" : "text-white"}`}
                onClick={() => setActiveTab("grievances")}
              >
                Grievances ({grievances.length})
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {getItemsToShow().length > 0 ? (
            <div className="space-y-4">{getItemsToShow()}</div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CalendarIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-lg">No items for this date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Main calendar component
export default function MonthlyCalendar() {
  const { events, fetchEvents, loading: eventsLoading } = useEvents()
  const { grievances, fetchGrievances, loading: grievancesLoading } = useGrievance()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchEvents()
    fetchGrievances()
  }, [])

  // Generate calendar days for current month view
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Get the day of week for first day (0-6, where 0 is Sunday)
    const startDayOfWeek = firstDay.getDay()

    // Create array for calendar days
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ day: null, date: null })
    }

    // Add actual days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day)
      const dateStr = formatDate(date)

      // Get events and grievances for this day
      const dayEvents = events.filter((event) => formatDate(new Date(event.eventDate)) === dateStr)

      const dayGrievances = grievances.filter((grievance) => formatDate(new Date(grievance.programDate)) === dateStr)

      days.push({
        day,
        date: dateStr,
        events: dayEvents,
        grievances: dayGrievances,
      })
    }

    return days
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Handle day click
  const handleDayClick = (day) => {
    if (!day.day) return
    setSelectedDate(new Date(day.date))
    setModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setModalOpen(false)
  }

  // Get calendar days
  const calendarDays = generateCalendarDays()

  // Loading state
  const isLoading = eventsLoading || grievancesLoading

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Calendar</h1>
          <p className="text-gray-600">View all events and grievances for the month</p>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft size={20} />
          </button>

          <h2 className="text-lg font-semibold text-gray-800">
            {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
          </h2>

          <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-4">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`
                  border rounded-lg p-2 min-h-[120px] 
                  ${!day.day ? "bg-gray-50" : "bg-white hover:shadow-md cursor-pointer"}
                  ${day?.events?.length > 0 || day?.grievances?.length > 0 ? "ring-1 ring-blue-200" : ""}
                  transition-all duration-200
                `}
                onClick={() => handleDayClick(day)}
              >
                {day.day && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">{day.day}</span>
                      {(day.events.length > 0 || day.grievances.length > 0) && (
                        <div className="flex space-x-1">
                          {day.events.length > 0 && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                          {day.grievances.length > 0 && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                        </div>
                      )}
                    </div>

                    <div className="overflow-y-auto max-h-[80px] space-y-1">
                      {day.events.slice(0, 2).map((event) => (
                        <EventItem key={event._id} event={event} />
                      ))}

                      {day.grievances.slice(0, 2).map((grievance) => (
                        <GrievanceItem key={grievance._id} grievance={grievance} />
                      ))}

                      {day.events.length + day.grievances.length > 4 && (
                        <div className="text-xs text-center text-gray-500 mt-1">
                          +{day.events.length + day.grievances.length - 4} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedDate && (
        <DetailModal
          isOpen={modalOpen}
          onClose={closeModal}
          selectedDate={selectedDate}
          events={events.filter((event) => formatDate(new Date(event.eventDate)) === formatDate(selectedDate))}
          grievances={grievances.filter(
            (grievance) => formatDate(new Date(grievance.programDate)) === formatDate(selectedDate),
          )}
        />
      )}
    </div>
  )
}
