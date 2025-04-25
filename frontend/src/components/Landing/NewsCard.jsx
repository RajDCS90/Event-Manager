import { Facebook, Twitter, Share2 } from "lucide-react";

export default function NewsCard({ item }) {
  return (
    <div className="group relative overflow-hidden rounded-md shadow-md bg-white hover:shadow-xl transition-all duration-300">
      <div className="overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="p-4 bg-orange-700 text-white">
        <h3 className="font-medium">{item.title}</h3>
      </div>
      {/* Overlay that slides up 35% on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-orange-600 text-white p-4 transform translate-y-full group-hover:translate-y-[6%] transition-transform duration-500 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm">{item.date}</p>
          <div className="flex space-x-2">
            <a href="#" className="text-white hover:text-blue-200 transition-colors duration-300">
              <Facebook size={16} />
            </a>
            <a href="#" className="text-white hover:text-blue-200 transition-colors duration-300">
              <Twitter size={16} />
            </a>
            <a href="#" className="text-white hover:text-blue-200 transition-colors duration-300">
              <Share2 size={16} />
            </a>
          </div>
        </div>
        <p href="#" className="text-white  text-sm mt-1 hover:text-blue-200 transition-colors duration-300">
          {item.type}
        </p>
      </div>
    </div>
  );
}
