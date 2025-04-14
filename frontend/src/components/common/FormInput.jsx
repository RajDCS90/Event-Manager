const FormInput = ({ label, name, type = 'text', value, onChange, options = [], required = false }) => {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
        >
          <option value="" disabled>
            Select {label}
          </option>
          {options.map((option) => {
            if (typeof option === 'string') {
              return (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
                </option>
              );
            } else {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            }
          })}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
        />
      )}
    </div>
  );
};

export default FormInput
