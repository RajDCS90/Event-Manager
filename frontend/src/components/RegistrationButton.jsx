export default function RegistrationButton({ setShowRegisterForm }) {
    return (
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setShowRegisterForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          Register Now
        </button>
      </div>
    );
  }