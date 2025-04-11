// src/components/common/Filter.jsx
import { useState } from 'react';

const Filter = ({ data, setFilteredData, columns }) => {
  const [filterColumn, setFilterColumn] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const handleFilter = () => {
    if (!filterColumn) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item => 
      String(item[filterColumn]).toLowerCase().includes(filterValue.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div className="flex items-end space-x-4 mb-4">
      <div className="w-1/4">
        <label className="block text-sm font-medium text-gray-700">Filter by</label>
        <select
          value={filterColumn}
          onChange={(e) => setFilterColumn(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
        >
          <option value="">Select column</option>
          {columns.map(column => (
            <option key={column.value} value={column.value}>
              {column.label}
            </option>
          ))}
        </select>
      </div>
      
      {filterColumn && (
        <div className="w-1/4">
          <label className="block text-sm font-medium text-gray-700">Search value</label>
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            onKeyUp={handleFilter}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
      )}
      
      <button
        onClick={handleFilter}
        disabled={!filterColumn}
        className={`px-4 py-2 rounded-md ${filterColumn ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
      >
        Apply Filter
      </button>
    </div>
  );
};

export default Filter;