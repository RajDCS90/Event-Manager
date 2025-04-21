import { MessageSquare } from "lucide-react";
import SectionHeader from "./SectionHeader";
import GrievanceCard from "./GrievanceCard";
import { useGrievance } from "../../context/GrievanceContext";
import { useEffect } from "react";

export default function GrievancesSection() {
  const {
    grievances,
    fetchGrievances,
  } = useGrievance();

  useEffect(() => {
    fetchGrievances();
  }, []);

  useEffect(() => {
    console.log("grievances", grievances);
  }, [grievances]);

  // Filter upcoming grievances and limit to 2
  const upcomingGrievances = grievances
    .filter(g => new Date(g.programDate) > new Date()) // filter future dates
    .sort((a, b) => new Date(a.programDate) - new Date(b.programDate)) // optional: sort by closest date
    .slice(0, 2); // take only top 2

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          icon={<MessageSquare size={20} className="text-white" />}
          title="Grievance Redressal"
          bgColor="bg-red-500"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingGrievances.map((item, index) => (
            <GrievanceCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}