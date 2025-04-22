import { useState } from "react";
import FormInput from "../common/FormInput";
import { usePartyAndYouth } from "../../context/P&YContext";

const PartyYouthForm = ({ onClose }) => {
  const { createMember } = usePartyAndYouth();

  const [formData, setFormData] = useState({
    aadharNo: "",
    name: "",
    whatsappNo: "",
    designation: "",
    address: {
      mandal: "Mandal 1",
      village: "",
      policeStation: "",
      postOffice: "",
      pincode: "",
      landmark: "",
    },
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

    if (name in formData.address) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createMember({
      ...formData,
      id: Date.now(),
      memberId: `PY-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    // Reset form
    setFormData({
      aadharNo: "",
      name: "",
      whatsappNo: "",
      designation: "",
      address: {
        mandal: "Mandal 1",
        village: "",
        policeStation: "",
        postOffice: "",
        pincode: "",
        landmark: "",
      },
    });

    onClose();
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
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <FormInput
            label="WhatsApp Number"
            name="whatsappNo"
            value={formData.whatsappNo}
            onChange={handleChange}
            type="tel"
            required
          />
          <FormInput
            label="Designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-md font-medium text-gray-800 mb-3">
            Member Address
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormInput
              label="Village"
              name="village"
              value={formData.address.village}
              onChange={handleChange}
              required
            />
       
            <FormInput
              label="Police Station"
              name="policeStation"
              value={formData.address.policeStation}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Post Office"
              name="postOffice"
              value={formData.address.postOffice}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Pincode"
              name="pincode"
              value={formData.address.pincode}
              onChange={handleChange}
              pattern="[0-9]{6}"
              maxLength="6"
              required
            />
            <FormInput
              label="Mandal"
              name="mandal"
              type="select"
              value={formData.address.mandal}
              onChange={handleChange}
              options={mandalOptions.map((m) => ({ value: m, label: m }))}
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
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700"
          >
            Add Member
          </button>
        </div>
      </form>
    </div>
  );
};

export default PartyYouthForm;
