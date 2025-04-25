import { CheckCircle2, Clock, MessageSquare } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useGrievance } from "../../context/GrievanceContext";
import { useEffect, useState } from "react";
// import GrievanceDetailModal from "../../pages/GrievanceDetailModal";
// import GrievanceDetailModal from "./GrievanceDetailModal";

export default function GrievancesSection() {
  const { grievances, fetchGrievances } = useGrievance();

  useEffect(() => {
    fetchGrievances();
  }, []);

  // Count resolved and pending grievances
  const resolvedCount = grievances.filter(g => g.status === "resolved").length;
  const pendingCount = grievances.filter(g => g.status === "pending").length;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          icon={<MessageSquare size={20} className="text-white" />}
          title="Grievance Redressal"
          bgColor=" bg-orange-500"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Resolved Grievances Count */}
          <div className="relative p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-green-100 overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-200 rounded-full opacity-20"></div>
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-green-300 rounded-full opacity-10"></div>
            <div className="flex items-center">
              <div className="p-3 mr-4 bg-white rounded-lg shadow-sm">
                <CheckCircle2 className="text-green-600" size={28} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Grievances Solved</h3>
                <p className="text-3xl font-bold text-green-700 mt-1">{resolvedCount}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-green-600 font-medium">
              {resolvedCount === 0 ? 'No grievances resolved yet' : 
               `${resolvedCount} ${resolvedCount === 1 ? 'grievance' : 'grievances'} successfully resolved`}
            </div>
          </div>

          {/* Pending Grievances Count */}
          <div className="relative p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-amber-100 overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-200 rounded-full opacity-20"></div>
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-300 rounded-full opacity-10"></div>
            <div className="flex items-center">
              <div className="p-3 mr-4 bg-white rounded-lg shadow-sm">
                <Clock className="text-amber-600" size={28} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Grievances Pending</h3>
                <p className="text-3xl font-bold text-amber-700 mt-1">{pendingCount}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-amber-600 font-medium">
              {pendingCount === 0 ? 'No pending grievances' : 
               `${pendingCount} ${pendingCount === 1 ? 'grievance' : 'grievances'} awaiting resolution`}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}