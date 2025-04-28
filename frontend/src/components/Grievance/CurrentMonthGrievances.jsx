import { useEffect } from "react";
import { format } from "date-fns"; 
import GrievanceTable from "./GrievanceTable";
import { useGrievance } from "../../context/GrievanceContext";

const CurrentMonthGrievances = () => {
  const { fetchGrievances } = useGrievance();

  useEffect(() => {
    // Get current month data on mount
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const filters = {
      startDate: format(firstDayOfMonth, "yyyy-MM-dd"),
      endDate: format(lastDayOfMonth, "yyyy-MM-dd")
    };
    
    fetchGrievances(filters);
  }, [fetchGrievances]);

  // Skip initial fetch in GrievanceTable since we're doing it here
  return <GrievanceTable skipInitialFetch={true} />;
};

export default CurrentMonthGrievances;