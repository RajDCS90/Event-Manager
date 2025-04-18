import { Calendar, AlertCircle } from 'lucide-react';

const MonthOverview = ({ events, grievances, currentMonth,setShowEventTables,setShowGravianceTables }) => {
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
        <div onClick={()=>setShowEventTables(true)} className="bg-blue-50 rounded-lg p-4 flex items-center">
          <div className="bg-blue-100 rounded-full p-3 mr-3">
            <Calendar size={24} className="text-blue-600" />
          </div>
          <div >
            <p className="text-sm text-blue-600">Events</p>
            <p className="text-2xl font-bold text-blue-700">{monthEvents.length}</p>
          </div>
        </div>
        
        <div onClick={()=>setShowGravianceTables(true)} className="bg-red-50 rounded-lg p-4 flex items-center">
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

export default MonthOverview;