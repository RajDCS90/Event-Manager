// src/components/common/Table.jsx
import { useState } from 'react';

const Table = ({ data, columns, onEdit, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editingField, setEditingField] = useState('');
  const [editingValue, setEditingValue] = useState('');

  const handleEditStart = (id, field, value) => {
    setEditingId(id);
    setEditingField(field);
    setEditingValue(value);
  };

  const handleEditSave = () => {
    if (editingId && editingField) {
      onEdit(editingId, editingField, editingValue);
    }
    setEditingId(null);
    setEditingField('');
    setEditingValue('');
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => (
              <th
                key={column.accessor}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
            {(onEdit || onDelete) && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map(item => (
              <tr key={item.id}>
                {columns.map(column => (
                  <td key={`${item.id}-${column.accessor}`} className="px-6 py-4 whitespace-nowrap">
                    {editingId === item.id && editingField === column.accessor ? (
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={handleEditSave}
                        onKeyPress={(e) => e.key === 'Enter' && handleEditSave()}
                        autoFocus
                        className="border rounded p-1"
                      />
                    ) : (
                      <div 
                        onClick={() => onEdit && handleEditStart(item.id, column.accessor, item[column.accessor])}
                        className={`${onEdit ? 'cursor-pointer hover:bg-gray-100 p-1 rounded' : ''}`}
                      >
                        {item[column.accessor]}
                      </div>
                    )}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => handleEditStart(item.id, columns[0].accessor, item[columns[0].accessor])}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;