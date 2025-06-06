import { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { format, addDays } from "date-fns";
import { useMandal } from "../../context/MandalContext";

const EventFilters = ({ filters, onFilterChange, onApplyFilters, onResetFilters, onClose }) => {
  const [dateOption, setDateOption] = useState("single");
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const { mandals, fetchMandals } = useMandal();
  
  const [areaOptions, setAreaOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  const [boothOptions, setBoothOptions] = useState([]);

  useEffect(() => {
    fetchMandals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(`address.${name}`, value);

    // Dynamic filtering logic
    if (name === "mandal") {
      const selectedMandal = mandals.find((m) => m.mandalName === value);
      setAreaOptions(selectedMandal?.areas || []);
      setVillageOptions([]);
      setBoothOptions([]);
      // Reset dependent fields
      onFilterChange(`address.area`, "");
      onFilterChange(`address.village`, "");
      onFilterChange(`address.booth`, "");
    }

    if (name === "area") {
      const selectedArea = areaOptions.find((a) => a.name === value);
      setVillageOptions(selectedArea?.villages || []);
      setBoothOptions([]);
      // Reset dependent fields
      onFilterChange(`address.village`, "");
      onFilterChange(`address.booth`, "");
    }

    if (name === "village") {
      const selectedVillage = villageOptions.find((v) => v.name === value);
      setBoothOptions(selectedVillage?.booths || []);
      // Reset dependent field
      onFilterChange(`address.booth`, "");
    }
  };

  const handleDateOptionChange = (e) => {
    const option = e.target.value;
    setDateOption(option);
    
    const today = new Date();
    let startDate, endDate;
  
    switch (option) {
      case "today":
        // Set to today
        onFilterChange("dateRange", {
          eventDate: format(today, "yyyy-MM-dd"),
          startDate: "",
          endDate: ""
        });
        setShowCustomDatePicker(false);
        break;
      case "7days":
        // Set to next 7 days
        startDate = today;
        endDate = addDays(today, 6); // 7 days including today
        onFilterChange("dateRange", {
          eventDate: "",
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd")
        });
        setShowCustomDatePicker(false);
        break;
      case "30days":
        // Set to next 30 days
        startDate = today;
        endDate = addDays(today, 29); // 30 days including today
        onFilterChange("dateRange", {
          eventDate: "",
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd")
        });
        setShowCustomDatePicker(false);
        break;
      case "custom":
        // Show custom date picker
        setShowCustomDatePicker(true);
        break;
      case "single":
        // Reset to single date only
        setShowCustomDatePicker(false);
        onFilterChange("dateRange", {
          eventDate: "",
          startDate: "",
          endDate: ""
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">Filter Events</h3>
        <button
          onClick={onClose}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            Venue
          </label>
          <input
            type="text"
            name="venue"
            value={filters.venue}
            onChange={handleChange}
            placeholder="Enter venue"
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Date Selection Options */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Selection
          </label>
          <select
            name="dateOption"
            value={dateOption}
            onChange={handleDateOptionChange}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
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
                  Event Date
                </label>
                <input
                  type="date"
                  name="dateRange.eventDate"
                  value={filters.dateRange?.eventDate || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {(showCustomDatePicker || ["7days", "30days"].includes(dateOption)) && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="dateRange.startDate"
                    value={filters.dateRange?.startDate || ""}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="dateRange.endDate"
                    value={filters.dateRange?.endDate || ""}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4">
        <h4 className="text-md font-medium text-gray-700 mb-2">
          Address Filters
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mandal
            </label>
            <select
              name="mandal"
              value={filters.address?.mandal || ""}
              onChange={handleAddressChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Mandal</option>
              {mandals.map((mandal) => (
                <option key={mandal._id} value={mandal.mandalName}>
                  {mandal.mandalName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area/Panchayat
            </label>
            <select
              name="area"
              value={filters.address?.area || ""}
              onChange={handleAddressChange}
              disabled={!filters.address?.mandal}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Area</option>
              {areaOptions.map((area) => (
                <option key={area.name} value={area.name}>
                  {area.name} ({area.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Village
            </label>
            <select
              name="village"
              value={filters.address?.village || ""}
              onChange={handleAddressChange}
              disabled={!filters.address?.area}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Village</option>
              {villageOptions.map((village) => (
                <option key={village.name} value={village.name}>
                  {village.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Booth
            </label>
            <select
              name="booth"
              value={filters.address?.booth || ""}
              onChange={handleAddressChange}
              disabled={!filters.address?.village}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Booth</option>
              {boothOptions.map((booth) => (
                <option key={booth.number} value={booth.number}>
                  {booth.number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Post Office
            </label>
            <input
              type="text"
              name="postOffice"
              value={filters.address?.postOffice || ""}
              onChange={handleAddressChange}
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
              value={filters.address?.policeStation || ""}
              onChange={handleAddressChange}
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
              value={filters.address?.pincode || ""}
              onChange={handleAddressChange}
              placeholder="Enter pincode"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={onResetFilters}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
        >
          Reset
        </button>
        <button
          onClick={onApplyFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default EventFilters;