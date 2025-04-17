import { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import { useGrievance } from '../context/GrievanceContext';
import { Calendar, ChevronLeft, ChevronRight, Plus, X, Clock, MapPin, CheckCircle, AlertCircle, Calendar as CalendarIcon, Filter, RefreshCcw } from 'lucide-react';

// Helper to format date as YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Helper to get day, month, year from date
const getDateDetails = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return { day, month, year };
};

// Custom calendar component
const CustomCalendar = ({ selectedDate, setSelectedDate, events, grievances }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Generate calendar days for current month view
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of week for first day (0-6, where 0 is Sunday)
    const startDayOfWeek = firstDay.getDay();
    
    // Create array for calendar days
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ day: null, date: null });
    }
    
    // Add actual days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDate(date);
      
      // Check if there are events or grievances on this day
      const hasEvents = events.some(event => formatDate(new Date(event.eventDate)) === dateStr);
      const hasGrievances = grievances.some(grievance => formatDate(new Date(grievance.programDate)) === dateStr);
      
      days.push({ 
        day, 
        date: dateStr,
        hasEvents,
        hasGrievances
      });
    }
    
    return days;
  };
  
  // Get calendar days
  const calendarDays = generateCalendarDays();
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={goToPreviousMonth}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={goToNextMonth}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`
              relative h-10 flex items-center justify-center text-sm rounded-md
              ${!day.day ? 'text-gray-300' : 'cursor-pointer hover:bg-gray-100'}
              ${day.date === formatDate(selectedDate) ? 'bg-blue-100 text-blue-600 font-bold' : ''}
              transition-all duration-200
            `}
            onClick={() => day.day && setSelectedDate(new Date(day.date))}
          >
            {day.day}
            {day.hasEvents && (
              <span className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
            )}
            {day.hasGrievances && (
              <span className="absolute bottom-1 left-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Badge component for status
const StatusBadge = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeStyle()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
  );
};

// Event card component
const EventCard = ({ event }) => {
  const { eventName, eventType, venue, status, eventDate, startTime, endTime } = event;
  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
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
          <span>{startTime} - {endTime}</span>
        </div>
        <div className="flex items-center mb-1">
          <MapPin size={16} className="mr-2 text-gray-500" />
          <span>{venue}</span>
        </div>
      </div>
      <div className="mt-3 flex justify-between items-center">
        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
          {eventType}
        </span>
      </div>
    </div>
  );
};

// Grievance card component
const GrievanceCard = ({ grievance }) => {
  const { grievanceName, type, applicant, status, programDate, startTime, endTime } = grievance;
  const formattedDate = new Date(programDate).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
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
          <span>{startTime} - {endTime}</span>
        </div>
        <div className="flex items-center mb-1">
          <AlertCircle size={16} className="mr-2 text-gray-500" />
          <span>Applicant: {applicant}</span>
        </div>
      </div>
      <div className="mt-3 flex justify-between items-center">
        <span className="bg-red-50 text-red-700 px-2 py-1 rounded-md text-xs font-medium">
          {type}
        </span>
      </div>
    </div>
  );
};

// Month overview component
const MonthOverview = ({ events, grievances, currentMonth }) => {
  // Helper to filter items for current month
  const getMonthItems = (items, dateField) => {
    return items.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate.getMonth() === currentMonth.getMonth() &&
             itemDate.getFullYear() === currentMonth.getFullYear();
    });
  };
  
  const monthEvents = getMonthItems(events, 'eventDate');
  const monthGrievances = getMonthItems(grievances, 'programDate');
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {currentMonth.toLocaleString('default', { month: 'long' })} Overview
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 flex items-center">
          <div className="bg-blue-100 rounded-full p-3 mr-3">
            <Calendar size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-blue-600">Events</p>
            <p className="text-2xl font-bold text-blue-700">{monthEvents.length}</p>
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 flex items-center">
          <div className="bg-red-100 rounded-full p-3 mr-3">
            <AlertCircle size={24} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm text-red-600">Grievances</p>
            <p className="text-2xl font-bold text-red-700">{monthGrievances.length}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Status Breakdown</h3>
        
        <div className="space-y-2">
          {['pending', 'completed', 'cancelled', 'in_progress'].map(status => {
            const eventsCount = monthEvents.filter(e => e.status === status).length;
            const grievancesCount = monthGrievances.filter(g => g.status === status).length;
            const total = eventsCount + grievancesCount;
            
            if (total === 0) return null;
            
            const getStatusColor = () => {
              switch (status) {
                case 'pending': return 'bg-yellow-500';
                case 'completed': return 'bg-green-500';
                case 'cancelled': return 'bg-red-500';
                case 'in_progress': return 'bg-blue-500';
                default: return 'bg-gray-500';
              }
            };
            
            return (
              <div key={status} className="flex items-center">
                <span className="text-xs text-gray-600 w-24">{status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden ml-2">
                  <div 
                    className={`h-full ${getStatusColor()}`} 
                    style={{ width: `${(total / (monthEvents.length + monthGrievances.length)) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 ml-2">{total}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Main component
export default function EventsAndGrievancesPage() {
  const { events, fetchEvents, loading: eventsLoading } = useEvents();
  const { grievances, fetchGrievances, loading: grievancesLoading } = useGrievance();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'events', 'grievances'
  const [showAddButton, setShowAddButton] = useState(false);
  
  useEffect(() => {
    fetchEvents();
    fetchGrievances();
  }, []);
  
  // Filter items for selected date
  const filteredEvents = events.filter(event =>
    formatDate(new Date(event.eventDate)) === formatDate(selectedDate)
  );
  
  const filteredGrievances = grievances.filter(grievance =>
    formatDate(new Date(grievance.programDate)) === formatDate(selectedDate)
  );
  
  // Combined list for "All" tab
  const combinedItems = [...filteredEvents.map(e => ({ ...e, type: 'event' })), 
                         ...filteredGrievances.map(g => ({ ...g, type: 'grievance' }))];
  
  // Sort by start time
  combinedItems.sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });
  
  // Items to show based on active tab
  const getItemsToShow = () => {
    switch (activeTab) {
      case 'events':
        return filteredEvents.map(event => <EventCard key={event._id} event={event} />);
      case 'grievances':
        return filteredGrievances.map(grievance => <GrievanceCard key={grievance._id} grievance={grievance} />);
      default:
        return combinedItems.map(item => 
          item.type === 'event' 
            ? <EventCard key={item._id} event={item} />
            : <GrievanceCard key={item._id} grievance={item} />
        );
    }
  };
  
  // Date details for selected date
  const { day, month, year } = getDateDetails(selectedDate);
  
  // Handle refresh data
  const handleRefresh = () => {
    fetchEvents();
    fetchGrievances();
  };
  
  // Loading state
  const isLoading = eventsLoading || grievancesLoading;
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events & Grievances Dashboard</h1>
          <p className="text-gray-600">Manage all your events and grievances in one place</p>
        </div>
        
        {/* <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
          >
            <RefreshCcw size={16} className="mr-2" />
            Refresh
          </button>
          
          <button 
            onClick={() => setShowAddButton(!showAddButton)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Add New
          </button>
        </div> */}
      </div>
      
      {/* Add button dropdown */}
      {showAddButton && (
        <div className="absolute right-6 mt-1 bg-white rounded-md shadow-lg z-10 transform origin-top-right transition-all duration-200 animate-fadeIn">
          <div className="py-1">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Add Event
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Add Grievance
            </button>
          </div>
        </div>
      )}
      
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
                  <p className="text-blue-100">{month} {year}</p>
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
                    className="p-1 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
                    className="p-1 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex space-x-1 bg-blue-800 bg-opacity-30 rounded-lg p-1 w-fit">
                  <button 
                    className={`px-4 py-1 rounded-md transition-colors ${activeTab === 'all' ? 'bg-white text-blue-700' : 'text-white'}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All ({combinedItems.length})
                  </button>
                  <button 
                    className={`px-4 py-1 rounded-md transition-colors ${activeTab === 'events' ? 'bg-white text-blue-700' : 'text-white'}`}
                    onClick={() => setActiveTab('events')}
                  >
                    Events ({filteredEvents.length})
                  </button>
                  <button 
                    className={`px-4 py-1 rounded-md transition-colors ${activeTab === 'grievances' ? 'bg-white text-blue-700' : 'text-white'}`}
                    onClick={() => setActiveTab('grievances')}
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
                <div className="space-y-4">
                  {getItemsToShow()}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <CalendarIcon size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-lg">No items for this date</p>
                  <p className="text-sm">Select another date or add a new item</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}