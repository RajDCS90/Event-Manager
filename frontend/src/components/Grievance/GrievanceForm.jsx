import { useState } from "react";
import FormInput from "../common/FormInput";
import { useGrievance } from "../../context/GrievanceContext";

const GrievanceForm = ({ onClose }) => {
  const { addGrievance } = useGrievance();

  const mandals = [
    "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon",
    "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
    "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial",
    "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet",
    "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy",
    "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban",
    "Yadadri Bhuvanagiri"
  ];

  const [formData, setFormData] = useState({
    grievanceName: "",
    type: "",
    applicant: "",
    registeredOn: new Date().toISOString().split("T")[0],
    programDate: "",
    startTime: "",
    endTime: "",
    status: "pending",
    description: "",
    assignedTo: "",
    resolutionNotes: "",
    mandal: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addGrievance(formData);

      setFormData({
        grievanceName: "",
        type: "",
        applicant: "",
        registeredOn: new Date().toISOString().split("T")[0],
        programDate: "",
        startTime: "",
        endTime: "",
        status: "pending",
        description: "",
        assignedTo: "",
        resolutionNotes: "",
        mandal: ""
      });

      onClose();
    } catch (error) {
      console.error("Failed to submit grievance:", error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg w-full">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-800">Add New Event</h2>
    </div>

    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormInput
          label="Event Name"
          name="eventName"
          value={formData.eventName}
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
            label="Mandal"
            name="mandal"
            type="select"
            value={formData.mandal}
            onChange={handleChange}
            options={mandals}
            required
            placeholder="Select Mandal"
          />
          <FormInput
            label="Registered On"
            name="registeredOn"
            type="date"
            value={formData.registeredOn}
            onChange={handleChange}
            disabled
          />
          <FormInput
            label="Program Date"
            name="programDate"
            type="date"
            value={formData.programDate}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Start Time"
            name="startTime"
            type="time"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
          <FormInput
            label="End Time"
            name="endTime"
            type="time"
            value={formData.endTime}
            onChange={handleChange}
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
