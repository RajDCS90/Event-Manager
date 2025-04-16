import {  useState } from "react";
import { X } from "lucide-react";
import { usePartyAndYouth } from "../../context/P&YContext";

export default function RegistrationForm({ setShowRegisterForm }) {
  const { createMember } = usePartyAndYouth()
  const [formData, setFormData] = useState({
    aadharNo: '',
    name: '',
    whatsappNo: '',
    designation: '',
    mandal: 'Mandal 1'
  });

  const mandalPanchayatOptions = ['Mandal 1', 'Mandal 2', 'Mandal 3', 'Panchayat A', 'Panchayat B'];
  const designationOptions = [
    "Select Designation",
    "President",
    "Vice President",
    "Secretary",
    "Treasurer",
    "Member",
    "Volunteer",
    "Other"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMember({
        ...formData,
        id: Date.now(),
        memberId: `PY-${Math.floor(1000 + Math.random() * 9000)}`
      });
      setFormData({
        aadharNo: '',
        name: '',
        whatsappNo: '',
        designation: '',
        mandal: 'Mandal 1'
      });
      setShowRegisterForm(false); // Close the form after successful submission
    } catch (error) {
      console.error("Error creating member:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl transform transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Party Youth Registration</h2>
          <button 
            onClick={() => setShowRegisterForm(false)} 
            className="hover:bg-gray-100 p-1 rounded-full transition-colors duration-300"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Aadhar Number</label>
            <input
              type="text"
              name="aadharNo"
              value={formData.aadharNo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              placeholder="Enter Aadhar number"
              required
              pattern="[0-9]{12}"
              maxLength="12"
              minLength="12"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">WhatsApp Number</label>
            <input
              type="tel"
              name="whatsappNo"
              value={formData.whatsappNo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              placeholder="Enter WhatsApp number"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Designation</label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              required
            >
              {designationOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Mandal/Panchayat</label>
            <select
              name="mandal"
              value={formData.mandal}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              required
            >
              {mandalPanchayatOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium transition-all duration-300 hover:shadow-lg"
          >
            Register Member
          </button>
        </form>
      </div>
    </div>
  );
}