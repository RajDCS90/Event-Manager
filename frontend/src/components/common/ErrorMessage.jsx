const ErrorMessage = ({ message }) => {
    return (
      <div className="mx-6 mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
        {message}
      </div>
    );
  };
  
  export default ErrorMessage;