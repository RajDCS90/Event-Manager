import { useState } from "react";
import FormInput from "../common/FormInput";
import { usePartyAndYouth } from "../../context/P&YContext";

const mandalData = {
  "Mandal 1": {
    villages: {
      "Village 1": {
        postOffice: "Village 1 PO",
        policeStation: "Village 1 PS",
        pincode: "500001"
      },
      "Village 2": {
        postOffice: "Village 2 PO",
        policeStation: "Village 2 PS",
        pincode: "500002"
      }
    }
  },
  "Mandal 2": {
    villages: {
      "Village 3": {
        postOffice: "Village 3 PO",
        policeStation: "Village 3 PS",
        pincode: "500003"
      },
      "Village 4": {
        postOffice: "Village 4 PO",
        policeStation: "Village 4 PS",
        pincode: "500004"
      }
    }
  },
  "Mandal 3": {
    villages: {
      "Village 5": {
        postOffice: "Village 5 PO",
        policeStation: "Village 5 PS",
        pincode: "500005"
      },
      "Village 6": {
        postOffice: "Village 6 PO",
        policeStation: "Village 6 PS",
        pincode: "500006"
      }
    }
  },
  "Mandal 4": {
    villages: {
      "Village 7": {
        postOffice: "Village 7 PO",
        policeStation: "Village 7 PS",
        pincode: "500007"
      },
      "Village 8": {
        postOffice: "Village 8 PO",
        policeStation: "Village 8 PS",
        pincode: "500008"
      }
    }
  },
  "Mandal 5": {
    villages: {
      "Village 9": {
        postOffice: "Village 9 PO",
        policeStation: "Village 9 PS",
        pincode: "500009"
      },
      "Village 10": {
        postOffice: "Village 10 PO",
        policeStation: "Village 10 PS",
        pincode: "500010"
      }
    }
  }
};

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

  const [villageOptions, setVillageOptions] = useState(['ecwe','wecw']);

  // Get mandal options from the mandalData keys
  const mandalOptions = Object.keys(mandalData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mandal") {
      // When mandal changes, update village options and reset village-related fields
      const villages = mandalData[value] ? Object.keys(mandalData[value].villages) : [];
      setVillageOptions(villages);
      
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          mandal: value,
          village: "",
          policeStation: "",
          postOffice: "",
          pincode: ""
        }
      }));
    } 
    else if (name === "village") {
      // When village changes, auto-fill the other address fields
      const selectedMandal = formData.address.mandal;
      const villageInfo = mandalData[selectedMandal]?.villages?.[value] || {};
      
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          village: value,
          policeStation: villageInfo.policeStation || "",
          postOffice: villageInfo.postOffice || "",
          pincode: villageInfo.pincode || ""
        }
      }));
    }
    else if (name in formData.address) {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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
        <h2 className="text-xl font-semibold text-gray-800">Add Party Youth</h2>
      </div>
  
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <FormInput
            label="Aadhar Number"
            name="aadharNo"
            type="number"
            value={formData.aadharNo}
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
              label="Mandal"
              name="mandal"
              type="select"
              value={formData.address.mandal}
              onChange={handleChange}
              options={mandalOptions.map(m => ({ value: m, label: m }))}
              required
            />
            <FormInput
              label="Village"
              name="village"
              type="select"
              value={formData.address.village}
              onChange={handleChange}
              options={[
                { value: "", label: "Select Village" },
                ...villageOptions.map(v => ({ value: v, label: v }))
              ]}
              required
              disabled={!formData.address.mandal}
            />
            <FormInput
              label="Police Station"
              name="policeStation"
              value={formData.address.policeStation}
              onChange={handleChange}
              required
              readOnly
            />
            <FormInput
              label="Post Office"
              name="postOffice"
              value={formData.address.postOffice}
              onChange={handleChange}
              required
              readOnly
            />
            <FormInput
              label="Pincode"
              name="pincode"
              value={formData.address.pincode}
              onChange={handleChange}
              pattern="[0-9]{6}"
              maxLength="6"
              required
              readOnly
            />
            <FormInput
              label="Landmark"
              name="landmark"
              value={formData.address.landmark}
              onChange={handleChange}
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