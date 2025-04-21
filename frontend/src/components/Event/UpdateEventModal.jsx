// UpdateEventModal.jsx
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useEvents } from "../../context/EventContext";
import { X, Upload, Image as ImageIcon, Trash2 } from "lucide-react";

const UpdateEventModal = ({ event, onClose }) => {
  const { updateEvent } = useEvents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [eventImage, setEventImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const mandalOptions = [
    "Mandal 1",
    "Mandal 2",
    "Mandal 3",
    "Mandal 4",
    "Mandal 5",
  ];
  const [form, setForm] = useState({
    eventName: "",
    eventType: "",
    venue: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    status: "",
    requesterName: "",
    requesterContact: "",
    // Additional fields if needed
    description: "",
    address: {
      village: "",
      postOffice: "",
      policeStation: "",
      pincode: "",
      mandal: '',
    }
  });

  // Initialize form with event data
  useEffect(() => {
    if (event) {
      try {
        // Format date for input date field
        const formattedDate = event.eventDate ?
          format(new Date(event.eventDate), "yyyy-MM-dd") :
          "";

        setForm({
          eventName: event.eventName || "",
          eventType: event.eventType || "",
          venue: event.venue || "",
          eventDate: formattedDate,
          startTime: event.startTime || "",
          endTime: event.endTime || "",
          status: event.status || "",
          // mandal: event.mandal || "",
          requesterName: event.requesterName || "",
          requesterContact: event.requesterContact || "",
          description: event.description || "",
          address: {
            village: event.address?.village || "",
            postOffice: event.address?.postOffice || "",
            policeStation: event.address?.policeStation || "",
            pincode: event.address?.pincode || "",
            mandal: event.address?.mandal || ""
          }
        });

        // Set image preview if the event has an image
        if (event.imageUrl) {
          setImagePreview(event.imageUrl);
        }
      } catch (err) {
        console.error("Error setting form data:", err);
        setError("Failed to load event details");
      }
    }
  }, [event]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const removeImage = () => {
    setEventImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate time format
      if (
        !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(form.startTime) ||
        !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(form.endTime)
      ) {
        throw new Error("Please enter time in HH:MM format (24-hour)");
      }

      if (form.startTime >= form.endTime) {
        throw new Error("End time must be after start time");
      }

      // Create FormData for file upload
      const formData = new FormData();
      // Append all form fields
      Object.keys(form).forEach(key => {
        if (key === 'address') {
          // Stringify the address object
          formData.append('address', JSON.stringify(form.address));
        } else if (form[key]) {
          formData.append(key, form[key]);
        }
      });

      // Append image if selected
      if (eventImage) {
        formData.append('image', eventImage);
      }

      const res = await updateEvent({
        _id: event._id,
        formData
      });

      onClose();
    } catch (err) {
      console.error("Error updating event:", err);
      setError(err.message || "Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Update Event</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <input
                type="text"
                name="eventName"
                value={form.eventName}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                name="eventType"
                value={form.eventType}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Type</option>
                <option value="political">Political</option>
                <option value="social">Social</option>
                <option value="commercial">Commercial</option>
                <option value="welfare">Welfare</option>
              </select>
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <input
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Mandal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mandal
              </label>
              <select
                name="address.mandal"
                value={form.address.mandal}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Mandal</option>
                {mandalOptions.map((mandal, index) => (
                  <option key={index} value={mandal}>
                    {mandal}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slots */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time (24h)
              </label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time (24h)
              </label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue
              </label>
              <input
                type="text"
                name="venue"
                value={form.venue}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Requester Info */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Requester Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requester Name
                </label>
                <input
                  type="text"
                  name="requesterName"
                  value={form.requesterName}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requester Contact
                </label>
                <input
                  type="text"
                  name="requesterContact"
                  value={form.requesterContact}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Address Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Village
                </label>
                <input
                  type="text"
                  name="address.village"
                  value={form.address.village}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Post Office
                </label>
                <input
                  type="text"
                  name="address.postOffice"
                  value={form.address.postOffice}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Police Station
                </label>
                <input
                  type="text"
                  name="address.policeStation"
                  value={form.address.policeStation}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="address.pincode"
                  value={form.address.pincode}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows="3"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          {/* Image Upload */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Event Image</h3>
            <div className="flex flex-col items-center">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-64 rounded-lg shadow border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer text-gray-500 hover:border-blue-400 hover:text-blue-500 transition">
                  <Upload className="w-6 h-6 mb-2" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}


              <label className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                <Upload size={16} className="mr-2" />
                {imagePreview ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-3 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                "Update Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEventModal;