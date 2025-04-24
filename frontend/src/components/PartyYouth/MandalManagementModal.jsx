import { useState, useEffect } from 'react';
import { useMandal } from '../../context/MandalContext';

const MandalManagementModal = () => {
  const {
    mandals,
    loading,
    fetchMandals,
    createMandal,
    updateMandal,
    deleteMandal
  } = useMandal();
  const [currentMandal, setCurrentMandal] = useState({
    mandalName: '',
    areas: []
  });
  const [editingId, setEditingId] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  // Form states
  const [newArea, setNewArea] = useState({
    name: '',
    type: 'Panchayat',
    villages: []
  });
  const [newVillage, setNewVillage] = useState({
    name: '',
    booths: []
  });
  const [newBooth, setNewBooth] = useState('');

  useEffect(() => {
    fetchMandals();
  }, []);

  const handleSubmitMandal = async () => {
    try {
      // Transform booths to match schema before saving
      const mandalData = {
        ...currentMandal,
        areas: currentMandal.areas.map(area => ({
          ...area,
          villages: area.villages.map(village => ({
            ...village,
            booths: village.booths.map(booth => ({ number: booth }))
          }))
        }))
      };

      if (editingId) {
        await updateMandal(editingId, mandalData);
      } else {
        await createMandal(mandalData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving mandal:', error);
    }
  };

  const handleEditMandal = (mandal) => {
    // Transform booths back to simple strings for editing
    const transformedMandal = {
      ...mandal,
      areas: mandal?.areas?.map(area => ({
        ...area,
        villages: area.villages?.map(village => ({
          ...village,
          booths: village.booths?.map(booth => booth.number)
        }))
      }))
    };
    setCurrentMandal(transformedMandal);
    setEditingId(mandal._id);
  };

  const handleDeleteMandal = async (id) => {
    try {
      await deleteMandal(id);
    } catch (error) {
      console.error('Error deleting mandal:', error);
    }
  };

  const addArea = () => {
    if (!newArea.name) return;
    setCurrentMandal({
      ...currentMandal,
      areas: [...currentMandal.areas, { ...newArea }]
    });
    setNewArea({
      name: '',
      type: 'Panchayat',
      villages: []
    });
  };

  const removeArea = (index) => {
    const updatedAreas = [...currentMandal.areas];
    updatedAreas.splice(index, 1);
    setCurrentMandal({
      ...currentMandal,
      areas: updatedAreas
    });
  };

  const addVillage = (areaIndex) => {
    if (!newVillage.name) return;
    const updatedAreas = [...currentMandal.areas];
    updatedAreas[areaIndex].villages.push({ ...newVillage });
    setCurrentMandal({
      ...currentMandal,
      areas: updatedAreas
    });
    setNewVillage({
      name: '',
      booths: []
    });
  };

  const removeVillage = (areaIndex, villageIndex) => {
    const updatedAreas = [...currentMandal.areas];
    updatedAreas[areaIndex].villages.splice(villageIndex, 1);
    setCurrentMandal({
      ...currentMandal,
      areas: updatedAreas
    });
  };

  const addBooth = (areaIndex, villageIndex) => {
    if (!newBooth) return;
    const updatedAreas = [...currentMandal.areas];
    updatedAreas[areaIndex].villages[villageIndex].booths.push(newBooth);
    setCurrentMandal({
      ...currentMandal,
      areas: updatedAreas
    });
    setNewBooth('');
  };

  const removeBooth = (areaIndex, villageIndex, boothIndex) => {
    const updatedAreas = [...currentMandal.areas];
    updatedAreas[areaIndex].villages[villageIndex].booths.splice(boothIndex, 1);
    setCurrentMandal({
      ...currentMandal,
      areas: updatedAreas
    });
  };

  const resetForm = () => {
    setCurrentMandal({
      mandalName: '',
      areas: []
    });
    setEditingIndex(null);
    setNewArea({
      name: '',
      type: 'Panchayat',
      villages: []
    });
    setNewVillage({
      name: '',
      booths: []
    });
    setNewBooth('');
  };


  return (
    // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div>
      <div className="bg-white rounded-lg w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Mandal Management</h3>
          </div>

          {/* Mandal Form */}
          <div className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mandal Name</label>
              <input
                type="text"
                value={currentMandal.mandalName}
                onChange={(e) => setCurrentMandal({ ...currentMandal, mandalName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter mandal name"
              />
            </div>

            {/* Areas (Panchayat/Ward) */}
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3">Add Panchayat/Ward</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newArea.name}
                    onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter area name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newArea.type}
                    onChange={(e) => setNewArea({ ...newArea, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Panchayat">Panchayat</option>
                    <option value="Ward">Ward</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={addArea}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Area
                  </button>
                </div>
              </div>

              {/* List of Areas */}
              {currentMandal.areas?.map((area, areaIndex) => (
                <div key={areaIndex} className="mb-6 border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-medium">
                      {area.name} ({area.type})
                    </h5>
                    <button
                      onClick={() => removeArea(areaIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Add Village */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Village Name</label>
                      <input
                        type="text"
                        value={newVillage.name}
                        onChange={(e) => setNewVillage({ ...newVillage, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter village name"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => addVillage(areaIndex)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Add Village
                      </button>
                    </div>
                  </div>

                  {/* List of Villages */}
                  {area.villages?.map((village, villageIndex) => (
                    <div key={villageIndex} className="mb-4 border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h6 className="font-medium">{village.name}</h6>
                        <button
                          onClick={() => removeVillage(areaIndex, villageIndex)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Add Booth */}
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={newBooth}
                          onChange={(e) => setNewBooth(e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded-md"
                          placeholder="Enter booth number"
                        />
                        <button
                          onClick={() => addBooth(areaIndex, villageIndex)}
                          className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        >
                          Add Booth
                        </button>
                      </div>

                      {/* List of Booths */}
                      <div className="flex flex-wrap gap-2">
                        {village.booths.map((booth, boothIndex) => (
                          <div key={boothIndex} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                            <span>{booth}</span>
                            <button
                              onClick={() => removeBooth(areaIndex, villageIndex, boothIndex)}
                              className="ml-1 text-red-600 hover:text-red-800"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitMandal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!currentMandal.mandalName || currentMandal.areas.length === 0}
              >
                {editingIndex !== null ? 'Update Mandal' : 'Save Mandal'}
              </button>
            </div>
          </div>

          {/* Existing Mandals */}
          {/* Existing Mandals */}
          <div className="border-t pt-4">
            <h4 className="text-lg font-medium mb-3">Existing Mandals</h4>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {mandals?.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No mandals found</p>
                ) : (
                  <div className="space-y-6">
                    {mandals?.map((mandal) => (
                      <div key={mandal._id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                          <h3 className="font-semibold text-gray-800">{mandal.mandalName}</h3>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditMandal(mandal)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMandal(mandal._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="divide-y divide-gray-200">
                          {/* Panchayats Section */}
                          <div className="p-4">
                            <h4 className="font-medium text-gray-700 mb-2">Panchayats ({mandal.areas?.filter(a => a.type === 'Panchayat').length})</h4>
                            {mandal.areas?.filter(a => a.type === 'Panchayat').map((panchayat, pIndex) => (
                              <div key={`${mandal._id}-panch-${pIndex}`} className="ml-4 mb-4 border-l-2 border-gray-200 pl-4">
                                <div className="font-medium text-gray-600">{panchayat.name}</div>
                                <div className="ml-4 mt-2 space-y-2">
                                  {panchayat.villages?.map((village, vIndex) => (
                                    <div key={`${mandal._id}-panch-${pIndex}-village-${vIndex}`} className="border rounded p-2">
                                      <div className="font-medium text-gray-600">{village.name}</div>
                                      <div className="flex flex-wrap gap-2 mt-1">
                                        {village.booths?.map((booth, bIndex) => (
                                          <span key={`${mandal._id}-panch-${pIndex}-village-${vIndex}-booth-${bIndex}`}
                                            className="bg-gray-100 px-2 py-1 rounded text-sm">
                                            Booth: {booth.number}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Wards Section */}
                          <div className="p-4">
                            <h4 className="font-medium text-gray-700 mb-2">Wards ({mandal.areas?.filter(a => a.type === 'Ward').length})</h4>
                            {mandal.areas?.filter(a => a.type === 'Ward').map((ward, wIndex) => (
                              <div key={`${mandal._id}-ward-${wIndex}`} className="ml-4 mb-4 border-l-2 border-gray-200 pl-4">
                                <div className="font-medium text-gray-600">{ward.name}</div>
                                <div className="ml-4 mt-2 space-y-2">
                                  {ward.villages?.map((village, vIndex) => (
                                    <div key={`${mandal._id}-ward-${wIndex}-village-${vIndex}`} className="border rounded p-2">
                                      <div className="font-medium text-gray-600">{village.name}</div>
                                      <div className="flex flex-wrap gap-2 mt-1">
                                        {village.booths?.map((booth, bIndex) => (
                                          <span key={`${mandal._id}-ward-${wIndex}-village-${vIndex}-booth-${bIndex}`}
                                            className="bg-gray-100 px-2 py-1 rounded text-sm">
                                            Booth: {booth.number}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandalManagementModal;