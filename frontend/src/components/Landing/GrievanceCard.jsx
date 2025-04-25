import { UserPlus, Share2 } from "lucide-react";

export default function GrievanceCard({ item , onClick}) {
  return (
    <div className="group relative overflow-hidden rounded-md shadow-md bg-white hover:shadow-xl transition-all duration-300" onClick={onClick}>
      <div className="overflow-hidden">
        <img
          src={item.imageUrl || 'https://images.pexels.com/photos/716276/pexels-photo-716276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
          className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
        />
      </div>
      <div className="p-4 bg-orange-700 text-white">
        <h3 className="font-medium">{item.grievanceName}</h3>
      </div>
      {/* Overlay that slides up 35% on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-orange-600 text-white p-4 transform translate-y-full group-hover:translate-y-[6%] transition-transform duration-500 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm">
            {item.startTime} - {item.endTime} / {item.mandal}
          </p>
          <div className="flex space-x-2">
            <a href="#" className="text-white hover:text-red-200 transition-colors duration-300">
              <UserPlus size={16} />
            </a>
            <a href="#" className="text-white hover:text-red-200 transition-colors duration-300">
              <Share2 size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
