import { useEffect, useState } from "react";
import FormInput from "../common/FormInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEvents } from "../../context/EventContext";
import { useMandal } from "../../context/MandalContext";

const EventForm = ({ onClose }) => {
  const { createEvent, loading } = useEvents();
  const { mandals, fetchMandals } = useMandal();

  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "political",
    venue: "",
    status: "pending",
    requesterName: "",
    requesterContact: "",
    eventDate: new Date(),
    startTime: "09:00",
    endTime: "10:00",
    description: "",
    address: {
      mandal: "",
      area: "",
      village: "",
      booth: "",
      postOffice: "",
      policeStation: "",
      pincode: "",
    },
  });

  const [areaOptions, setAreaOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  const [boothOptions, setBoothOptions] = useState([]);

  useEffect(() => {
    fetchMandals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));

    // Dynamic filtering logic
    if (name === "mandal") {
      const selectedMandal = mandals.find((m) => m.mandalName === value);
      setAreaOptions(selectedMandal?.areas || []);
      setVillageOptions([]);
      setBoothOptions([]);
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          area: "",
          village: "",
          booth: "",
        },
      }));
    }

    if (name === "area") {
      const selectedArea = areaOptions.find((a) => a.name === value);
      setVillageOptions(selectedArea?.villages || []);
      setBoothOptions([]);
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          village: "",
          booth: "",
        },
      }));
    }

    if (name === "village") {
      const selectedVillage = villageOptions.find((v) => v.name === value);
      setBoothOptions(selectedVillage?.booths || []);
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          booth: "",
        },
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, eventDate: date }));
  };

  const handleTimeChange = (e, field) => {
    const value = e.target.value;
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value) || value === "") {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.startTime >= formData.endTime) {
        alert("End time must be after start time");
        return;
      }

      await createEvent({
        ...formData,
        eventDate: formData.eventDate.toISOString(),
      });

      // Reset form
      setFormData({
        eventName: "",
        eventType: "political",
        venue: "",
        status: "pending",
        requesterName: "",
        requesterContact: "",
        eventDate: new Date(),
        startTime: "09:00",
        endTime: "10:00",
        description: "",
        address: {
          mandal: "",
          area: "",
          village: "",
          booth: "",
          postOffice: "",
          policeStation: "",
          pincode: "",
        },
      });

      onClose();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Add New Event</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormInput label="Event Name" name="eventName" value={formData.eventName} onChange={handleChange} required />
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
          <FormInput label="Venue" name="venue" value={formData.venue} onChange={handleChange} required />
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
            <DatePicker
              selected={formData.eventDate}
              onChange={handleDateChange}
              className="w-full p-2 border rounded"
              minDate={new Date()}
              required
            />
          </div>
          <FormInput
            label="Start Time (HH:MM)"
            name="startTime"
            type="text"
            value={formData.startTime}
            onChange={(e) => handleTimeChange(e, "startTime")}
            placeholder="HH:MM"
            required
          />
          <FormInput
            label="End Time (HH:MM)"
            name="endTime"
            type="text"
            value={formData.endTime}
            onChange={(e) => handleTimeChange(e, "endTime")}
            placeholder="HH:MM"
            required
          />
          <FormInput label="Requester Name" name="requesterName" value={formData.requesterName} onChange={handleChange} required />
          <FormInput label="Requester Contact" name="requesterContact" type="tel" value={formData.requesterContact} onChange={handleChange} required />
        </div>

        <FormInput label="Event Description" name="description" value={formData.description} onChange={handleChange} type="textarea" required />

        <div className="border-t pt-4">
          <h3 className="text-md font-medium text-gray-800 mb-3">Event Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormInput
              label="Mandal"
              name="mandal"
              type="select"
              value={formData.address.mandal}
              onChange={handleAddressChange}
              options={mandals.map((m) => ({ value: m.mandalName, label: m.mandalName }))}
              required
            />
            <FormInput
              label="Area"
              name="area"
              type="select"
              value={formData.address.area}
              onChange={handleAddressChange}
              options={areaOptions.map((a) => ({ value: a.name, label: `${a.name} (${a.type})` }))}
              required
            />
            <FormInput
              label="Village"
              name="village"
              type="select"
              value={formData.address.village}
              onChange={handleAddressChange}
              options={villageOptions.map((v) => ({ value: v.name, label: v.name }))}
              required
            />
            <FormInput
              label="Booth"
              name="booth"
              type="select"
              value={formData.address.booth}
              onChange={handleAddressChange}
              options={boothOptions.map((b) => ({ value: b.number, label: b.number }))}
              required
            />
            <FormInput
              label="Post Office"
              name="postOffice"
              value={formData.address.postOffice}
              onChange={handleAddressChange}
              required
            />
            <FormInput
              label="Police Station"
              name="policeStation"
              value={formData.address.policeStation}
              onChange={handleAddressChange}
              required
            />
            <FormInput
              label="Pincode"
              name="pincode"
              value={formData.address.pincode}
              onChange={handleAddressChange}
              pattern="[0-9]{6}"
              maxLength="6"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Add Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
