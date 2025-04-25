import { useState } from "react";
import { format, subDays, startOfToday, endOfToday } from "date-fns";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS file

const DateRangeDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState({
    startDate: value?.startDate ? new Date(value.startDate) : new Date(),
    endDate: value?.endDate ? new Date(value.endDate) : new Date(),
  });

  const handleSelect = (ranges) => {
    setRange({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    });
  };

  const applyDateRange = () => {
    onChange({
      startDate: format(range.startDate, "yyyy-MM-dd"),
      endDate: format(range.endDate, "yyyy-MM-dd"),
    });
    setIsOpen(false);
  };

  const quickSelect = (days) => {
    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);
    onChange({
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    });
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>
          {value?.startDate && value?.endDate
            ? `${format(new Date(value.startDate), "MMM d, yyyy")} - ${format(new Date(value.endDate), "MMM d, yyyy")}`
            : "Select date range"}
        </span>
        <svg
          className={`w-5 h-5 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-4">
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => quickSelect(1)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              >
                Today
              </button>
              <button
                onClick={() => quickSelect(7)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              >
                Last 7 Days
              </button>
              <button
                onClick={() => quickSelect(30)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              >
                Last 30 Days
              </button>
            </div>

            <Calendar
              editableDateInputs={true}
              onChange={handleSelect}
              moveRangeOnFirstSelection={false}
              ranges={[{
                startDate: range.startDate,
                endDate: range.endDate,
                key: "selection",
              }]}
              minDate={subDays(new Date(), 365)}
              maxDate={new Date()}
            />

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 mr-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={applyDateRange}
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeDropdown