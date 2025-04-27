import { useEffect, useState } from "react";
import FormInput from "../common/FormInput";
import { usePartyAndYouth } from "../../context/P&YContext";
import { useMandal } from "../../context/MandalContext";

const PartyYouthForm = ({ onClose }) => {
  const { createMember } = usePartyAndYouth();
  const { mandals, fetchMandals } = useMandal();

  const [formData, setFormData] = useState({
    aadharNo: "",
    name: "",
    whatsappNo: "",
    designation: "",
    address: {
      mandal: "",
      areaType: "",
      area: "",
      village: "",
      booth: "",
      policeStation: "",
      postOffice: "",
      pincode: "",
      landmark: "",
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

    if (name === "mandal") {
      // When mandal changes, reset all dependent fields
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          mandal: value,
          areaType: "",
          area: "",
          village: "",
          booth: "",
          policeStation: "",
          postOffice: "",
          pincode: ""
        }
      }));
    }
    else if (name === "areaType") {
      // When area type (Panchayat/Ward) changes, update area options
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          areaType: value,
          area: "",
          village: "",
          booth: "",
          policeStation: "",
          postOffice: "",
          pincode: ""
        }
      }));
    }
    else if (name === "area") {
      // When area changes, update village options
      const selectedMandal = mandals.find(m => m.mandalName === formData.address.mandal);
      const selectedArea = selectedMandal?.areas.find(a => a.name === value);
      const villages = selectedArea?.villages?.map(v => v.name) || [];

      setVillageOptions(villages);

      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          area: value,
          village: "",
          booth: "",
          policeStation: "",
          postOffice: "",
          pincode: ""
        }
      }));
    }
    else if (name === "village") {
      // When village changes, update booth options
      const selectedMandal = mandals.find(m => m.mandalName === formData.address.mandal);
      const selectedArea = selectedMandal?.areas.find(a => a.name === formData.address.area);
      const selectedVillage = selectedArea?.villages?.find(v => v.name === value);
      const booths = selectedVillage?.booths?.map(b => b.number) || [];

      setBoothOptions(booths);

      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          village: value,
          booth: "",
          policeStation: "",
          postOffice: "",
          pincode: ""
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
        mandal: "",
        areaType: "",
        area: "",
        village: "",
        booth: "",
        policeStation: "",
        postOffice: "",
        pincode: "",
        landmark: "",
      },
    });

    onClose();
  };

  // Get mandal options from the mandals data
  const mandalOptions = mandals.map(m => m.mandalName);

  // Get area type options (Panchayat/Ward) based on selected mandal
  const areaTypeOptions = [];
  const selectedMandal = mandals.find(m => m.mandalName === formData.address.mandal);
  if (selectedMandal) {
    const hasPanchayat = selectedMandal.areas.some(a => a.type === "Panchayat");
    const hasWard = selectedMandal.areas.some(a => a.type === "Ward");

    if (hasPanchayat) areaTypeOptions.push("Panchayat");
    if (hasWard) areaTypeOptions.push("Ward");
  }

  // Get area options (Panchayat/Ward names) based on selected mandal and area type
  const filteredAreaOptions = [];
  if (selectedMandal && formData.address.areaType) {
    filteredAreaOptions.push(
      ...selectedMandal.areas
        .filter(a => a.type === formData.address.areaType)
        .map(a => a.name)
    );
  }

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
            value={formData.aadharNo}
            onChange={handleChange}
            required
            maxLength={12}
            pattern="\d{12}"
            title="Please enter exactly 12 digits"
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
              options={[
                { value: "", label: "Select Mandal" },
                ...mandalOptions.map(m => ({ value: m, label: m }))
              ]}
              required
            />

            {formData.address.mandal && (
              <FormInput
                label="Area Type"
                name="areaType"
                type="select"
                value={formData.address.areaType}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select Type" },
                  ...areaTypeOptions.map(t => ({ value: t, label: t }))
                ]}
                required
              />
            )}

            {formData.address.areaType && (
              <FormInput
                label={formData.address.areaType}
                name="area"
                type="select"
                value={formData.address.area}
                onChange={handleChange}
                options={[
                  { value: "", label: `Select ${formData.address.areaType}` },
                  ...filteredAreaOptions.map(a => ({ value: a, label: a }))
                ]}
                required
              />
            )}

            {formData.address.area && (
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
              />
            )}

            {formData.address.village && (
              <FormInput
                label="Booth"
                name="booth"
                type="select"
                value={formData.address.booth}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select Booth" },
                  ...boothOptions.map(b => ({ value: b, label: b }))
                ]}
                required
              />
            )}

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