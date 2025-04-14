import { X, Search } from "lucide-react";

export default function MobileMenu({ isMenuOpen, setIsMenuOpen }) {
  return (
    <div
      className={`fixed inset-0 bg-indigo-900 z-50 transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      } lg:hidden`}
    >
      <div className="flex justify-end p-4">
        <button onClick={() => setIsMenuOpen(false)}>
          <X size={24} className="text-white" />
        </button>
      </div>
      <nav className="flex flex-col items-center p-4">
        <a href="#" className="text-white py-3 text-lg">
          Mera Saansad
        </a>
        <a href="#" className="text-white py-3 text-lg">
          Download App
        </a>
        <a href="#" className="text-white py-3 text-lg">
          Login / Register
        </a>
        <div className="relative mt-4 w-full max-w-xs">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-8 pr-4 py-2 border rounded-full text-sm"
          />
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        </div>
        <select className="mt-4 border rounded py-2 px-4 w-full max-w-xs">
          <option>English</option>
          <option>Hindi</option>
        </select>
      </nav>
    </div>
  );
}