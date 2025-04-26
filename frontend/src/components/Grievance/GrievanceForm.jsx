import { useEffect, useState } from "react";
import FormInput from "../common/FormInput";
import { useGrievance } from "../../context/GrievanceContext";
import { useMandal } from "../../context/MandalContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const GrievanceForm = ({ onClose }) => {
  const { createGrievance } = useGrievance();
  const { mandals, fetchMandals } = useMandal();

  const [formData, setFormData] = useState({
    grievanceName: "",
    type: "",
    applicant: "",
    registeredOn: new Date().toISOString().split("T")[0],
    programDate: new Date(),
    startTime: "09:00",
    endTime: "10:00",
    status: "pending",
    description: "",
    assignedTo: "",
    resolutionNotes: "",
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

  const [areaOptions, setAreaOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  const [boothOptions, setBoothOptions] = useState([]);

  useEffect(() => {
    fetchMandals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));

    // Dynamic filtering logic
    if (name === "mandal") {
      const selectedMandal = mandals.find(m => m.mandalName === value);
      setAreaOptions(selectedMandal?.areas || []);
      setVillageOptions([]);
      setBoothOptions([]);
      setFormData(prev => ({
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
      const selectedArea = areaOptions.find(a => a.name === value);
      setVillageOptions(selectedArea?.villages || []);
      setBoothOptions([]);
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          village: "",
          booth: "",
        },
      }));
    }

    if (name === "village") {
      const selectedVillage = villageOptions.find(v => v.name === value);
      setBoothOptions(selectedVillage?.booths || []);
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          booth: "",
        },
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, programDate: date }));
  };

  const handleTimeChange = (e, field) => {
    const value = e.target.value;
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value) || value === "") {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.startTime >= formData.endTime) {
        alert("End time must be after start time");
        return;
      }

      await createGrievance({
        ...formData,
        programDate: formData.programDate.toISOString(),
      });

      // Reset form
      setFormData({
        grievanceName: "",
        type: "",
        applicant: "",
        registeredOn: new Date().toISOString().split("T")[0],
        programDate: new Date(),
        startTime: "09:00",
        endTime: "10:00",
        status: "pending",
        description: "",
        assignedTo: "",
        resolutionNotes: "",
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

      onClose();
    } catch (error) {
      console.error("Failed to submit grievance:", error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Add Grievance Event</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormInput
            label="Grievance Name"
            name="grievanceName"
            value={formData.grievanceName}
            onChange={handleChange}
            required
          />
          
          <FormInput
            label="Type"
            name="type"
            type="select"
            value={formData.type}
            onChange={handleChange}
            options={["complaint", "request", "feedback", "other"]}
            required
          />
          
          <FormInput
            label="Applicant"
            name="applicant"
            value={formData.applicant}
            onChange={handleChange}
            required
          />
          
          <FormInput
            label="Registered On"
            name="registeredOn"
            type="date"
            value={formData.registeredOn}
            onChange={handleChange}
            disabled
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Date</label>
            <DatePicker
              selected={formData.programDate}
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
          
          <FormInput
            label="Status"
            name="status"
            type="select"
            value={formData.status}
            onChange={handleChange}
            options={["pending", "in_progress", "completed", "cancelled"]}
          />
          
          <FormInput
            label="Assigned To"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            required
          />
        </div>

        {/* Address Section */}
        <div className="border-t pt-4">
          <h3 className="text-md font-medium text-gray-800 mb-3">Address Details</h3>
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
              disabled={!formData.address.mandal}
              required
            />
            
            <FormInput
              label="Village"
              name="village"
              type="select"
              value={formData.address.village}
              onChange={handleAddressChange}
              options={villageOptions.map((v) => ({ value: v.name, label: v.name }))}
              disabled={!formData.address.area}
              required
            />
            
            <FormInput
              label="Booth"
              name="booth"
              type="select"
              value={formData.address.booth}
              onChange={handleAddressChange}
              options={boothOptions.map((b) => ({ value: b.number, label: b.number }))}
              disabled={!formData.address.village}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            required
            className="w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resolution Notes (optional)
          </label>
          <textarea
            name="resolutionNotes"
            value={formData.resolutionNotes}
            onChange={handleChange}
            rows={2}
            className="w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
          />
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
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700"
          >
            Submit Grievance
          </button>
        </div>
      </form>
    </div>
  );
};

export default GrievanceForm;