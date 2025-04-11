// src/components/Event/EventForm.jsx
import { useState } from "react";
import FormInput from "../common/FormInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEvents } from "../../context/EventContext";

const EventForm = () => {
  const { createEvent, loading, error } = useEvents();
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "political",
    venue: "",
    status: "pending",
    mandal: "Mandal 1",
    requesterName: "",
    requesterContact: "",
    eventDate: new Date(),
    startTime: "09:00",
    endTime: "10:00",
  });

  const mandalOptions = [
    "Mandal 1",
    "Mandal 2",
    "Mandal 3",
    "Mandal 4",
    "Mandal 5",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, eventDate: date }));
  };

  const handleTimeChange = (e, field) => {
    const value = e.target.value;
    // Basic time format validation
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value) || value === "") {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
       // Validate end time is after start time
    if (formData.startTime >= formData.endTime) {
      alert("End time must be after start time");
      return;
    }

    await createEvent({
      ...formData,
      eventDate: formData.eventDate.toISOString()
    });
    setFormData({
      eventName: "",
      eventType: "political",
      venue: "",
      status: "pending",
      mandal: "Mandal 1",
      requesterName: "",
      requesterContact: "",
      eventDate: new Date(),
      startTime: "09:00",
      endTime: "10:00",
    });
    } catch (error) {
      console.log(error.message)
    }
   
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Event Name"
          name="eventName"
          value={formData.eventName}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Event Type"
          name="eventType"
          type="select"
          value={formData.eventType}
          onChange={handleChange}
          options={[
            { value: "political", label: "Political" },
            { value: "social", label: "Social" },
            { value: "commercial", label: "Commercial" },
            { value: "welfare", label: "Welfare" },
          ]}
        />

        <FormInput
          label="Venue"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Status"
          name="status"
          type="select"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: "pending", label: "Pending" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
          ]}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Date
          </label>
          <DatePicker
            selected={formData.eventDate}
            onChange={handleDateChange}
            className="w-full p-2 border rounded"
            minDate={new Date()}
            required
          />
        </div>

        <FormInput
          label="Mandal"
          name="mandal"
          type="select"
          value={formData.mandal}
          onChange={handleChange}
          options={mandalOptions.map((m) => ({ value: m, label: m }))}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time (HH:MM)
          </label>
          <input
            type="text"
            name="startTime"
            value={formData.startTime}
            onChange={(e) => handleTimeChange(e, "startTime")}
            className="w-full p-2 border rounded"
            pattern="([0-1]?[0-9]|2[0-3]):[0-5][0-9]"
            placeholder="HH:MM"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time (HH:MM)
          </label>
          <input
            type="text"
            name="endTime"
            value={formData.endTime}
            onChange={(e) => handleTimeChange(e, "endTime")}
            className="w-full p-2 border rounded"
            pattern="([0-1]?[0-9]|2[0-3]):[0-5][0-9]"
            placeholder="HH:MM"
            required
          />
        </div>

        <FormInput
          label="Requester Name"
          name="requesterName"
          value={formData.requesterName}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Requester Contact"
          name="requesterContact"
          value={formData.requesterContact}
          onChange={handleChange}
          type="tel"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Event
      </button>
    </form>
  );
};

export default EventForm;
