import { useState } from "react";
import { X } from "lucide-react";

export default function RegistrationForm({ setShowRegisterForm }) {
  const [customPanchayat, setCustomPanchayat] = useState(false);
  const [selectedPanchayat, setSelectedPanchayat] = useState("");

  const panchayatOptions = [
    "Select Panchayat",
    "Rajpur Panchayat",
    "Ganeshpur Panchayat",
    "Bhimgarh Panchayat",
    "Lakshmipur Panchayat",
    "Chandpur Panchayat",
    "Ramgarh Panchayat",
    "Shivpuri Panchayat",
    "Add New Panchayat",
  ];

  const handlePanchayatChange = (e) => {
    const value = e.target.value;
    setSelectedPanchayat(value);
    setCustomPanchayat(value === "Add New Panchayat");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl transform transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Register</h2>
          <button onClick={() => setShowRegisterForm(false)} className="hover:bg-gray-100 p-1 rounded-full transition-colors duration-300">
            <X size={24} />
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              placeholder="Enter your WhatsApp number"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Panchayat Area
            </label>
            <select
              onChange={handlePanchayatChange}
              value={selectedPanchayat}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2 transition-all duration-300"
            >
              {panchayatOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {customPanchayat && (
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-2 transition-all duration-300"
                placeholder="Enter panchayat name"
              />
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Location</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              placeholder="Enter your location"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium transition-all duration-300 hover:shadow-lg"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
