import { useEffect, useState } from "react";
import { format, parseISO, addDays } from "date-fns";
import { useAuth } from "../../context/AuthContext";
import {
  Edit,
  Trash,
  User,
  Search,
} from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { useGrievance } from "../../context/GrievanceContext";
import GrievanceEditModal from "./GrievanceEditModal";
import GrievanceDetailModal from "./GrievanceDetailModal";

const GrievanceTable = ({ skipInitialFetch = false }) => {
  const { grievances, loading, error, deleteGrievance, fetchGrievances } =
    useGrievance();

  const [filteredGrievances, setFilteredGrievances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("");
  const [mandalFilter, setMandalFilter] = useState("");
  const [dateOption, setDateOption] = useState("single");
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    programDate: "",
    startDate: "",
    endDate: "",
  });

  // Extract unique values for filter dropdowns
  const statuses = [...new Set(grievances.map((g) => g.status))];
  const mandals = [...new Set(grievances.map((g) => g.mandal))];

  useEffect(() => {
    if (!skipInitialFetch) {
      fetchGrievancesWithFilters();
    }
  }, [statusFilter, mandalFilter, dateRange, skipInitialFetch]);

  useEffect(() => {
    setFilteredGrievances(grievances);
  }, [grievances]);

  const fetchGrievancesWithFilters = () => {
    const filters = {};
    if (statusFilter) filters.status = statusFilter;
    if (mandalFilter) filters.mandal = mandalFilter;

    if (dateOption === "single" && dateRange.programDate) {
      filters.programDate = dateRange.programDate;
    } else if (["today", "7days", "30days", "custom"].includes(dateOption)) {
      if (dateRange.startDate && dateRange.endDate) {
        filters.startDate = dateRange.startDate;
        filters.endDate = dateRange.endDate;
      }
    }

    fetchGrievances(filters);
  };

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

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === "") {
      setFilteredGrievances(grievances);
    } else {
      setFilteredGrievances(
        grievances.filter(
          (grievance) =>
            grievance.grievanceName.toLowerCase().includes(term) ||
            grievance.applicant.toLowerCase().includes(term) ||
            grievance.assignedTo.toLowerCase().includes(term)
        )
      );
    }
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleMandalFilterChange = (e) => {
    setMandalFilter(e.target.value);
  };

  const handleDateOptionChange = (e) => {
    const option = e.target.value;
    setDateOption(option);

    const today = new Date();
    let startDate, endDate;

    switch (option) {
      case "today":
        setDateRange({
          programDate: format(today, "yyyy-MM-dd"),
          startDate: format(today, "yyyy-MM-dd"),
          endDate: format(today, "yyyy-MM-dd"),
        });
        setShowCustomDatePicker(false);
        break;
      case "7days":
        startDate = today;
        endDate = addDays(today, 6);
        setDateRange({
          programDate: "",
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd"),
        });
        setShowCustomDatePicker(false);
        break;
      case "30days":
        startDate = today;
        endDate = addDays(today, 29);
        setDateRange({
          programDate: "",
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd"),
        });
        setShowCustomDatePicker(false);
        break;
      case "custom":
        setShowCustomDatePicker(true);
        break;
      case "single":
      default:
        setShowCustomDatePicker(false);
        setDateRange({
          programDate: "",
          startDate: "",
          endDate: "",
        });
        break;
    }
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setStatusFilter("");
    setMandalFilter("");
    setDateOption("single");
    setShowCustomDatePicker(false);
    setDateRange({
      programDate: "",
      startDate: "",
      endDate: "",
    });
    setSearchTerm("");
    fetchGrievances();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this grievance?")) {
      try {
        await deleteGrievance(id);
        fetchGrievancesWithFilters();
      } catch (error) {
        console.error("Error deleting grievance:", error);
        alert(error.message || "Failed to delete grievance");
      }
    }
  };

  const openDetailModal = (grievance) => {
    setSelectedGrievance(grievance);
    setDetailModalOpen(true);
    setEditModal(false); // Explicitly close edit modal when opening detail modal
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            Grievance Management
          </h2>
          <div className="mt-4 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search grievances..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter controls */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mandal
            </label>
            <select
              value={mandalFilter}
              onChange={handleMandalFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Mandals</option>
              {mandals.map((mandal) => (
                <option key={mandal} value={mandal}>
                  {mandal}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
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

            {/* Date Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {dateOption === "single" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Program Date
                  </label>
                  <input
                    type="date"
                    name="programDate"
                    value={dateRange.programDate}
                    onChange={handleDateRangeChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {(showCustomDatePicker ||
                ["7days", "30days"].includes(dateOption)) && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={dateRange.startDate}
                      onChange={handleDateRangeChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={dateRange.endDate}
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
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition duration-150"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-gray-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p>Loading grievances...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Grievance Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mandal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Program Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGrievances.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No grievances found
                  </td>
                </tr>
              ) : (
                filteredGrievances.map((grievance) => (
                  <tr key={grievance._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openDetailModal(grievance)}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {grievance.grievanceName}
                      </button>
                    </td>
                    <td className="px-6 py-4 capitalize">{grievance.type}</td>
                    <td className="px-6 py-4 capitalize">{grievance.mandal}</td>
                    <td className="px-6 py-4 flex items-center">
                      <User className="mr-1 text-gray-400" />
                      {grievance.applicant}
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(grievance.programDate)} at{" "}
                      {formatTime(grievance.startTime)} -{" "}
                      {formatTime(grievance.endTime)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={grievance.status} />
                    </td>
                    <td className="px-6 py-4">{grievance.assignedTo}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedGrievance(grievance);
                          setEditModal(true);
                          setDetailModalOpen(false); // Explicitly close detail modal when opening edit modal
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(grievance._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {editModal && selectedGrievance && (
        <GrievanceEditModal
          grievance={selectedGrievance}
          isOpen={editModal}
          onClose={() => {
            setEditModal(false);
            setSelectedGrievance(null);
          }}
          onSave={(updatedGrievance) => {
            setEditModal(false);
            setSelectedGrievance(null);
          }}
        />
      )}

      {detailModalOpen && selectedGrievance && (
        <GrievanceDetailModal
          grievance={selectedGrievance}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedGrievance(null);
          }}
        />
      )}
    </div>
  );
};

export default GrievanceTable;
