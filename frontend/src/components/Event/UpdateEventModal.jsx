import { useState, useEffect, useCallback } from "react";
import { useEvents } from "../../context/EventContext";
import { useMandal } from "../../context/MandalContext";
import { X, Upload, Trash2 } from "lucide-react";
import FormInput from "../common/FormInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UpdateEventModal = ({ event, onClose }) => {
  const { updateEvent } = useEvents();
  const { mandals, fetchMandals } = useMandal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [eventImage, setEventImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [resetImage, setResetImage] = useState(false);
  
  // For hierarchical address selection
  const [areaOptions, setAreaOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  const [boothOptions, setBoothOptions] = useState([]);
  
  // Track modified fields
  const [modifiedFields, setModifiedFields] = useState({
    // Event fields
    eventName: false,
    eventType: false,
    venue: false,
    eventDate: false,
    startTime: false,
    endTime: false,
    status: false,
    requesterName: false,
    requesterContact: false,
    description: false,
    
    // Address fields
    address: {
      mandal: false,
      area: false,
      village: false,
      booth: false,
      postOffice: false,
      policeStation: false,
      pincode: false
    }
  });

  const [form, setForm] = useState({
    eventName: "",
    eventType: "",
    venue: "",
    eventDate: new Date(),
    startTime: "",
    endTime: "",
    status: "",
    requesterName: "",
    requesterContact: "",
    description: "",
    address: {
      mandal: "",
      area: "",
      village: "",
      booth: "",
      postOffice: "",
      policeStation: "",
      pincode: "",
    }
  });

  // Initialize form with event data
  useEffect(() => {
    if (event) {
      try {
        // Fetch mandals if not loaded
        if (mandals.length === 0) {
          fetchMandals();
        }
        
        // Format date for input date field
        const eventDate = event.eventDate ? new Date(event.eventDate) : new Date();
        
        // Handle mandal field - could be an object with _id and mandalName or just a string
        let mandalName = "";
        if (event.address?.mandal) {
          mandalName = typeof event.address.mandal === 'object' 
            ? event.address.mandal.mandalName 
            : event.address.mandal;
        }

        const initialForm = {
          eventName: event.eventName || "",
          eventType: event.eventType || "",
          venue: event.venue || "",
          eventDate: eventDate,
          startTime: event.startTime || "",
          endTime: event.endTime || "",
          status: event.status || "",
          requesterName: event.requesterName || "",
          requesterContact: event.requesterContact || "",
          description: event.description || "",
          address: {
            mandal: event.address?.mandalName || mandalName,
            area: event.address?.area || "",
            village: event.address?.village || "",
            booth: event.address?.booth || "",
            postOffice: event.address?.postOffice || "",
            policeStation: event.address?.policeStation || "",
            pincode: event.address?.pincode || ""
          }
        };

        setForm(initialForm);

        // Set image preview if the event has an image
        if (event.imageUrl) {
          setImagePreview(event.imageUrl);
        }
      } catch (err) {
        console.error("Error setting form data:", err);
        setError("Failed to load event details");
      }
    }
  }, [event, fetchMandals, mandals.length]);

  // Setup hierarchical options when mandals or form changes
  useEffect(() => {
    if (mandals.length > 0 && form.address.mandal) {
      // Find mandal and set area options
      const selectedMandal = mandals.find(m => m.mandalName === form.address.mandal);
      if (selectedMandal) {
        setAreaOptions(selectedMandal.areas || []);
        
        // Find area and set village options
        if (form.address.area) {
          const selectedArea = selectedMandal.areas.find(a => a.name === form.address.area);
          if (selectedArea) {
            setVillageOptions(selectedArea.villages || []);
            
            // Find village and set booth options
            if (form.address.village) {
              const selectedVillage = selectedArea.villages.find(v => v.name === form.address.village);
              if (selectedVillage) {
                setBoothOptions(selectedVillage.booths || []);
              }
            }
          }
        }
      }
    }
  }, [mandals, form.address.mandal, form.address.area, form.address.village]);

  // Generic handler for input changes that tracks modifications
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      
      // Mark as modified
      setModifiedFields(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: true
        }
      }));
      
      // Update form value
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      // Mark as modified
      setModifiedFields(prev => ({
        ...prev,
        [name]: true
      }));
      
      // Update form value
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Special handler for address fields with cascading dependencies
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    
    // Mark this field as modified
    setModifiedFields(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: true
      }
    }));
    
    // Update form
    setForm(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));

    // Reset dependent fields based on hierarchy
    if (name === "mandal") {
      const selectedMandal = mandals.find(m => m.mandalName === value);
      setAreaOptions(selectedMandal?.areas || []);
      setVillageOptions([]);
      setBoothOptions([]);
      
      // Reset dependent fields
      setForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          area: "",
          village: "",
          booth: "",
        },
      }));
      
      // Mark dependent fields as modified since they're being reset
      setModifiedFields(prev => ({
        ...prev,
        address: {
          ...prev.address,
          area: true,
          village: true,
          booth: true
        }
      }));
    }

    if (name === "area") {
      const selectedMandal = mandals.find(m => m.mandalName === form.address.mandal);
      const selectedArea = selectedMandal?.areas.find(a => a.name === value);
      setVillageOptions(selectedArea?.villages || []);
      setBoothOptions([]);
      
      // Reset dependent fields
      setForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          village: "",
          booth: "",
        },
      }));
      
      // Mark dependent fields as modified
      setModifiedFields(prev => ({
        ...prev,
        address: {
          ...prev.address,
          village: true,
          booth: true
        }
      }));
    }

    if (name === "village") {
      const selectedMandal = mandals.find(m => m.mandalName === form.address.mandal);
      const selectedArea = selectedMandal?.areas.find(a => a.name === form.address.area);
      const selectedVillage = selectedArea?.villages.find(v => v.name === value);
      setBoothOptions(selectedVillage?.booths || []);
      
      // Reset dependent field
      setForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          booth: "",
        },
      }));
      
      // Mark dependent field as modified
      setModifiedFields(prev => ({
        ...prev,
        address: {
          ...prev.address,
          booth: true
        }
      }));
    }
  };

  const handleDateChange = (date) => {
    setForm(prev => ({ ...prev, eventDate: date }));
    setModifiedFields(prev => ({ ...prev, eventDate: true }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventImage(file);
      setResetImage(false);
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
    setResetImage(true);
  };

  const validateForm = useCallback(() => {
    // Check if any required fields that were modified are invalid
    if (modifiedFields.eventName && !form.eventName) return "Event name is required";
    if (modifiedFields.eventType && !form.eventType) return "Event type is required";
    if (modifiedFields.venue && !form.venue) return "Venue is required";
    if (modifiedFields.startTime || modifiedFields.endTime) {
      // Validate time format if either time field was modified
      if (modifiedFields.startTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(form.startTime)) {
        return "Start time must be in HH:MM format";
      }
      if (modifiedFields.endTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(form.endTime)) {
        return "End time must be in HH:MM format";
      }
      
      // Validate time logic only if both fields have values
      if (form.startTime && form.endTime) {
        const startMinutes = convertTimeToMinutes(form.startTime);
        const endMinutes = convertTimeToMinutes(form.endTime);
        if (startMinutes >= endMinutes) {
          return "End time must be after start time";
        }
      }
    }
    
    // Validate requester info
    if (modifiedFields.requesterName && !form.requesterName) return "Requester name is required";
    if (modifiedFields.requesterContact) {
      if (!form.requesterContact) return "Requester contact is required";
      if (!/^\d{10}$/.test(form.requesterContact)) {
        return "Contact number must be 10 digits";
      }
    }
    
    // Validate address hierarchy only if fields were modified
    if (modifiedFields.address.mandal && form.address.mandal && 
        modifiedFields.address.area && !form.address.area) {
      return "Area is required when Mandal is provided";
    }
    
    if (modifiedFields.address.area && form.address.area && 
        modifiedFields.address.village && !form.address.village) {
      return "Village is required when Area is provided";
    }
    
    if (modifiedFields.address.village && form.address.village && 
        modifiedFields.address.booth && !form.address.booth) {
      return "Booth is required when Village is provided";
    }
    
    // Validate pincode if modified
    if (modifiedFields.address.pincode && form.address.pincode && 
        !/^\d{6}$/.test(form.address.pincode)) {
      return "Pincode must be 6 digits";
    }
    
    return null; // No errors
  }, [form, modifiedFields]);

  const convertTimeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate form
      const validationError = validateForm();
      if (validationError) {
        throw new Error(validationError);
      }

      // Create FormData for file upload
      const formData = new FormData();
      
      // Only append modified fields
      Object.keys(form).forEach(key => {
        if (key !== 'address' && key !== 'eventDate' && modifiedFields[key]) {
          formData.append(key, form[key]);
        }
      });

      // Handle date separately if modified
      if (modifiedFields.eventDate) {
        formData.append('eventDate', form.eventDate.toISOString());
      }

      // For address, only include fields that were actually modified
      const modifiedAddressFields = {};
      Object.keys(form.address).forEach(key => {
        if (modifiedFields.address[key]) {
          modifiedAddressFields[key] = form.address[key];
        }
      });
      
      // Only include address if something was changed
      if (Object.keys(modifiedAddressFields).length > 0) {
        formData.append('address', JSON.stringify(modifiedAddressFields));
      }

      // Handle image upload
      if (eventImage) {
        formData.append('image', eventImage);
      } else if (resetImage) {
        // Signal the backend to remove the image
        formData.append('removeImage', 'true');
      }

      // Check if we have any updates to submit
      if ([...formData.keys()].length === 0) {
        setError("No changes detected");
        setIsSubmitting(false);
        return;
      }

      await updateEvent({
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Update Event</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
            <FormInput 
              label="Event Name"
              name="eventName"
              value={form.eventName}
              onChange={handleInputChange}
              required={modifiedFields.eventName}
            />

            {/* Event Type */}
            <FormInput
              label="Event Type"
              name="eventType"
              type="select"
              value={form.eventType}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Select Event Type" },
                { value: "political", label: "Political" },
                { value: "social", label: "Social" },
                { value: "commercial", label: "Commercial" },
                { value: "welfare", label: "Welfare" },
              ]}
              required={modifiedFields.eventType}
            />

            {/* Venue */}
            <FormInput 
              label="Venue"
              name="venue"
              value={form.venue}
              onChange={handleInputChange}
              required={modifiedFields.venue}
            />

            {/* Status */}
            <FormInput
              label="Status"
              name="status"
              type="select"
              value={form.status}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Select Status" },
                { value: "pending", label: "Pending" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
                { value: "in_progress", label: "In Progress" },
              ]}
              required={modifiedFields.status}
            />

            {/* Event Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <DatePicker
                selected={form.eventDate}
                onChange={handleDateChange}
                className="w-full p-2 border rounded"
                minDate={new Date()}
              />
            </div>

            {/* Start Time */}
            <FormInput
              label="Start Time (HH:MM)"
              name="startTime"
              type="text"
              value={form.startTime}
              onChange={handleInputChange}
              placeholder="HH:MM"
              required={modifiedFields.startTime}
            />

            {/* End Time */}
            <FormInput
              label="End Time (HH:MM)"
              name="endTime"
              type="text"
              value={form.endTime}
              onChange={handleInputChange}
              placeholder="HH:MM"
              required={modifiedFields.endTime}
            />
          </div>

          {/* Requester Info */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Requester Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput 
                label="Requester Name"
                name="requesterName"
                value={form.requesterName}
                onChange={handleInputChange}
                required={modifiedFields.requesterName}
              />

              <FormInput 
                label="Requester Contact"
                name="requesterContact"
                value={form.requesterContact}
                onChange={handleInputChange}
                pattern="[0-9]{10}"
                maxLength="10"
                required={modifiedFields.requesterContact}
              />
            </div>
          </div>

          {/* Address Details */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Address Details
              <span className="text-sm font-normal text-gray-500 ml-2">
                (Only fields you change will be updated)
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormInput
                label="Mandal"
                name="mandal"
                type="select"
                value={form.address.mandal}
                onChange={handleAddressChange}
                options={[
                  { value: "", label: "-- Select Mandal --" },
                  ...mandals.map(m => ({ value: m.mandalName, label: m.mandalName }))
                ]}
              />
              
              <FormInput
                label="Area"
                name="area"
                type="select"
                value={form.address.area}
                onChange={handleAddressChange}
                options={[
                  { value: "", label: "-- Select Area --" },
                  ...areaOptions.map(a => ({ value: a.name, label: `${a.name} (${a.type})` }))
                ]}
                disabled={!form.address.mandal}
              />
              
              <FormInput
                label="Village"
                name="village"
                type="select"
                value={form.address.village}
                onChange={handleAddressChange}
                options={[
                  { value: "", label: "-- Select Village --" },
                  ...villageOptions.map(v => ({ value: v.name, label: v.name }))
                ]}
                disabled={!form.address.area}
              />
              
              <FormInput
                label="Booth"
                name="booth"
                type="select"
                value={form.address.booth}
                onChange={handleAddressChange}
                options={[
                  { value: "", label: "-- Select Booth --" },
                  ...boothOptions.map(b => ({ value: b.number, label: b.number }))
                ]}
                disabled={!form.address.village}
              />
              
              <FormInput
                label="Post Office"
                name="postOffice"
                value={form.address.postOffice}
                onChange={handleAddressChange}
              />
              
              <FormInput
                label="Police Station"
                name="policeStation"
                value={form.address.policeStation}
                onChange={handleAddressChange}
              />
              
              <FormInput
                label="Pincode"
                name="pincode"
                value={form.address.pincode}
                onChange={handleAddressChange}
                pattern="[0-9]{6}"
                maxLength="6"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <FormInput
              label="Description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              type="textarea"
              required={modifiedFields.description}
            />
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