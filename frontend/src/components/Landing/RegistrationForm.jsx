import { useState } from "react";
import { X } from "lucide-react";
import { usePartyAndYouth } from "../../context/P&YContext";

export default function RegistrationForm({ setShowRegisterForm }) {
  const { createMember } = usePartyAndYouth();
  const [formData, setFormData] = useState({
    aadharNo: '',
    name: '',
    whatsappNo: '',
    designation: '',
    address: {
      mandal: 'Mandal 1', // Mandatory field
      village: '',
      street: '',
      policeStation: '',
      postOffice: '',
      pincode: ''
    }
  });

  const mandalPanchayatOptions = ['Mandal 1', 'Mandal 2', 'Mandal 3', 'Panchayat A', 'Panchayat B'];
  const designationOptions = [
    "Select Designation",
    "Member",
    "Volunteer",
  ];

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
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate mandatory address fields
    if (!formData.address.mandal) {
      alert("Mandal is required in address");
      return;
    }

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
        address: {
          mandal: 'Mandal 1',
          village: '',
          policeStation: '',
          postOffice: '',
          pincode: ''
        }
      });
      setShowRegisterForm(false);
    } catch (error) {
      console.error("Error creating member:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-2">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-screen overflow-y-auto p-5 shadow-2xl transform transition-all duration-300">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">Party Youth Registration</h2>
          <button
            onClick={() => setShowRegisterForm(false)}
            className="hover:bg-gray-100 p-1 rounded-full transition-colors duration-300"
          >
            <X size={22} />
          </button>
        </div>
  
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-1 lg:col-span-3">
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter full name"
                required
              />
            </div>
  
            <div>
              <label className="block text-gray-700 mb-1">Aadhar Number</label>
              <input
                type="text"
                name="aadharNo"
                value={formData.aadharNo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter Aadhar number"
                required
                pattern="[0-9]{12}"
                maxLength="12"
                minLength="12"
              />
            </div>
  
            <div>
              <label className="block text-gray-700 mb-1">WhatsApp Number</label>
              <input
                type="tel"
                name="whatsappNo"
                value={formData.whatsappNo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter WhatsApp number"
                required
              />
            </div>
  
            <div>
              <label className="block text-gray-700 mb-1">Designation</label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              >
                {designationOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
  
          {/* Address Info */}
          <div className="border-t pt-3">
            <h3 className="text-md font-medium text-gray-800 mb-3">Address Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Mandal*</label>
                <select
                  name="mandal"
                  value={formData.address.mandal}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                >
                  {mandalPanchayatOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
  
              <div>
                <label className="block text-gray-700 mb-1">Village</label>
                <input
                  type="text"
                  name="village"
                  value={formData.address.village}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Enter village name"
                />
              </div>
  
              <div>
                <label className="block text-gray-700 mb-1">Police Station</label>
                <input
                  type="text"
                  name="policeStation"
                  value={formData.address.policeStation}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Enter nearest police station"
                />
              </div>
  
              <div>
                <label className="block text-gray-700 mb-1">Post Office</label>
                <input
                  type="text"
                  name="postOffice"
                  value={formData.address.postOffice}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Enter post office"
                />
              </div>
  
              <div>
                <label className="block text-gray-700 mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.address.pincode}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Enter 6-digit pincode"
                  pattern="[0-9]{6}"
                  maxLength="6"
                  minLength="6"
                />
              </div>
            </div>
          </div>
  
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium transition-all duration-300 hover:shadow-lg"
            >
              Register Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
  
}