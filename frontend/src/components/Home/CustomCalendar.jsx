import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

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

export default CustomCalendar;