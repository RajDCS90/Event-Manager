const LoadingSpinner = ({ message }) => {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        <p>{message}</p>
      </div>
    );
  };
  export default LoadingSpinner;  