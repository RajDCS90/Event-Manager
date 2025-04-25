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
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Existing Mandals</h4>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {mandals?.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No mandals found</h3>
                    <p className="mt-1 text-sm text-gray-500">Create your first mandal to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {mandals?.map((mandal) => (
                      <div key={mandal._id} className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                        {/* Mandal Header */}
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-5 py-4 flex justify-between items-center border-b border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {mandal.mandalName}
                          </h3>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEditMandal(mandal)}
                              className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMandal(mandal._id)}
                              className="text-red-600 hover:text-red-800 flex items-center text-sm font-medium"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Panchayats Section */}
                        <div className="p-5">
                          <div className="flex items-center mb-4">
                            <h4 className="font-medium text-gray-700 text-base flex items-center">
                              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Panchayats ({mandal.areas?.filter(a => a.type === 'Panchayat').length || 0})
                            </h4>
                          </div>
                          <div className="space-y-4 pl-7">
                            {mandal.areas?.filter(a => a.type === 'Panchayat').length > 0 ? (
                              mandal.areas.filter(a => a.type === 'Panchayat').map((panchayat, pIndex) => (
                                <div key={`${mandal._id}-panch-${pIndex}`} className="border-l-2 border-green-200 pl-4">
                                  <div className="font-medium text-gray-700 bg-green-50 px-3 py-2 rounded-md flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {panchayat.name}
                                  </div>
                                  <div className="ml-4 mt-3 space-y-3">
                                    {panchayat.villages?.map((village, vIndex) => (
                                      <div key={`${mandal._id}-panch-${pIndex}-village-${vIndex}`} className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs">
                                        <div className="font-medium text-gray-700 flex items-center">
                                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                          </svg>
                                          {village.name}
                                        </div>
                                        {village.booths?.length > 0 && (
                                          <div className="mt-2">
                                            <h5 className="text-xs font-medium text-gray-500 mb-1">BOOTHS</h5>
                                            <div className="flex flex-wrap gap-2">
                                              {village.booths?.map((booth, bIndex) => (
                                                <span key={`${mandal._id}-panch-${pIndex}-village-${vIndex}-booth-${bIndex}`}
                                                  className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                                                  {booth.number}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-gray-500 italic pl-4">No panchayats added</div>
                            )}
                          </div>
                        </div>

                        {/* Wards Section */}
                        <div className="p-5 border-t border-gray-200 bg-gray-50">
                          <div className="flex items-center mb-4">
                            <h4 className="font-medium text-gray-700 text-base flex items-center">
                              <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              Wards ({mandal.areas?.filter(a => a.type === 'Ward').length || 0})
                            </h4>
                          </div>
                          <div className="space-y-4 pl-7">
                            {mandal.areas?.filter(a => a.type === 'Ward').length > 0 ? (
                              mandal.areas.filter(a => a.type === 'Ward').map((ward, wIndex) => (
                                <div key={`${mandal._id}-ward-${wIndex}`} className="border-l-2 border-purple-200 pl-4">
                                  <div className="font-medium text-gray-700 bg-purple-50 px-3 py-2 rounded-md flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {ward.name}
                                  </div>
                                  <div className="ml-4 mt-3 space-y-3">
                                    {ward.villages?.map((village, vIndex) => (
                                      <div key={`${mandal._id}-ward-${wIndex}-village-${vIndex}`} className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs">
                                        <div className="font-medium text-gray-700 flex items-center">
                                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                          </svg>
                                          {village.name}
                                        </div>
                                        {village.booths?.length > 0 && (
                                          <div className="mt-2">
                                            <h5 className="text-xs font-medium text-gray-500 mb-1">BOOTHS</h5>
                                            <div className="flex flex-wrap gap-2">
                                              {village.booths?.map((booth, bIndex) => (
                                                <span key={`${mandal._id}-ward-${wIndex}-village-${vIndex}-booth-${bIndex}`}
                                                  className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-xs font-medium">
                                                  {booth.number}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-gray-500 italic pl-4">No wards added</div>
                            )}
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