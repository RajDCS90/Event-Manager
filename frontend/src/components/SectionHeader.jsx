export default function SectionHeader({ icon, title, bgColor }) {
    return (
      <div className="flex items-center mb-8">
        <div className={`w-10 h-10 ${bgColor} flex items-center justify-center mr-4`}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold uppercase text-gray-800">
          {title}
        </h2>
      </div>
    );
  }