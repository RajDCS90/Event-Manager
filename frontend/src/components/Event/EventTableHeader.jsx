import { Filter } from "lucide-react";

const EventTableHeader = ({ searchTerm, onSearch, showFilters, setShowFilters }) => {
  return (
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
              onChange={(e) => onSearch(e.target.value)}
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
  );
};

export default EventTableHeader;