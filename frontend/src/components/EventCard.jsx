import { Calendar, Share2 } from "lucide-react";

export default function EventCard({ item, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-md shadow-md bg-white cursor-pointer"
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 bg-orange-600 text-white">
        <h3 className="font-medium">{item.title}</h3>
      </div>
      {/* Overlay that slides up 20% on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-orange-700 text-white p-4 transform translate-y-full group-hover:translate-y-[6%] transition-transform duration-300 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm">
            {item.date} - {item.location}
          </p>
          <div className="flex space-x-2">
            <a href="#" className="text-white hover:text-orange-200">
              <Calendar size={16} />
            </a>
            <a href="#" className="text-white hover:text-orange-200">
              <Share2 size={16} />
            </a>
          </div>
        </div>
        <a href="#" className="text-white underline text-sm mt-1">
          Register for Event
        </a>
      </div>
    </div>
  );
}