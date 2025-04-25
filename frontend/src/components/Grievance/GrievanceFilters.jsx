import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Search } from 'lucide-react';

const GrievanceFilters = ({
  statuses,
  mandals,
  filters,
  onFilterChange,
  onResetFilters,
  onSearch
}) => {
  const [dateOption, setDateOption] = useState('single');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const handleDateOptionChange = (e) => {
    const option = e.target.value;
    setDateOption(option);
    
    const today = new Date();
    let startDate, endDate;

    switch (option) {
      case "today":
        onFilterChange('dateRange', {
          programDate: format(today, "yyyy-MM-dd"),
          startDate: format(today, "yyyy-MM-dd"),
          endDate: format(today, "yyyy-MM-dd")
        });
        setShowCustomDatePicker(false);
        break;
      case "7days":
        startDate = today;
        endDate = addDays(today, 6);
        onFilterChange('dateRange', {
          programDate: "",
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd")
        });
        setShowCustomDatePicker(false);
        break;
      case "30days":
        startDate = today;
        endDate = addDays(today, 29);
        onFilterChange('dateRange', {
          programDate: "",
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd")
        });
        setShowCustomDatePicker(false);
        break;
      case "custom":
        setShowCustomDatePicker(true);
        break;
      case "single":
      default:
        setShowCustomDatePicker(false);
        onFilterChange('dateRange', {
          programDate: "",
          startDate: "",
          endDate: ""
        });
        break;
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    onFilterChange('dateRange', {
      ...filters.dateRange,
      [name]: value
    });
  };

  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Grievance Management</h2>
        <div className="mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search grievances..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
              value={filters.searchTerm}
              onChange={onSearch}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mandal</label>
          <select
            name="mandal"
            value={filters.mandal}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Mandals</option>
            {mandals.map(mandal => (
              <option key={mandal} value={mandal}>{mandal}</option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select
            value={dateOption}
            onChange={handleDateOptionChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="single">Single Date</option>
            <option value="today">Today</option>
            <option value="7days">Next 7 Days</option>
            <option value="30days">Next 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {dateOption === "single" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program Date</label>
                <input
                  type="date"
                  name="programDate"
                  value={filters.dateRange.programDate}
                  onChange={handleDateRangeChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {(showCustomDatePicker || ["7days", "30days"].includes(dateOption)) && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.dateRange.startDate}
                    onChange={handleDateRangeChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.dateRange.endDate}
                    onChange={handleDateRangeChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onResetFilters}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition duration-150"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default GrievanceFilters;