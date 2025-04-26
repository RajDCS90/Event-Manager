// // src/context/GrievanceContext.jsx
// import { createContext, useContext, useEffect, useState } from 'react';
// import api from '../services/api';
// import { useToast } from './ToastContext';

// const GrievanceContext = createContext();

// export const useGrievance = () => useContext(GrievanceContext);

// export const GrievanceProvider = ({ children }) => {
//   const [grievances, setGrievances] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { notify } = useToast(); // Get the notify function from ToastContext
  
//   const fetchGrievances = async (filters = {}) => {
//     try {
//       setLoading(true);
      
//       // Prepare API params
//       const params = {};
      
//       if (filters.status) params.status = filters.status;
//       if (filters.mandal) params.mandal = filters.mandal;
      
//       // Handle date filters
//       if (filters.programDate) {
//         params.programDate = filters.programDate;
//       } else if (filters.startDate && filters.endDate) {
//         params.startDate = filters.startDate;
//         params.endDate = filters.endDate;
//       }
      
//       const query = new URLSearchParams(params).toString();
//       const res = await api.get(`/grievances?${query}`);
//       setGrievances(res.data);
//       setError(null);
//     } catch (err) {
//       console.error('Failed to fetch grievances:', err);
//       setError(err.response?.data?.message || 'Failed to fetch grievances');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addGrievance = async (data) => {
//     try {
//       setLoading(true);
//       const res = await api.post('/grievances', data);
//       setGrievances(prev => [...prev, res.data]);
//       setError(null);
//       notify('Grievance created successfully!', 'success');
//       return res.data;
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || 'Failed to create grievance';
//       setError(errorMessage);
//       notify(errorMessage, 'error');
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateGrievance = async (id, data) => {
//     try {
//       setLoading(true);
//       const res = await api.put(`/grievances/${id}`, data);
//       setGrievances(prev =>
//         prev.map(g => (g._id === id ? res.data : g))
//       );
//       setError(null);
//       notify('Grievance updated successfully!', 'success');
//       return res.data;
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || 'Failed to update grievance';
//       setError(errorMessage);
//       notify(errorMessage, 'error');
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteGrievance = async (id) => {
//     try {
//       setLoading(true);
//       await api.delete(`/grievances/${id}`);
//       setGrievances(prev => prev.filter(g => g._id !== id));
//       setError(null);
//       notify('Grievance deleted successfully!', 'success');
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || 'Failed to delete grievance';
//       setError(errorMessage);
//       notify(errorMessage, 'error');
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <GrievanceContext.Provider value={{
//       grievances,
//       loading,
//       error,
//       fetchGrievances,
//       addGrievance,
//       updateGrievance,
//       deleteGrievance,
//     }}>
//       {children}
//     </GrievanceContext.Provider>
//   );
// };



import { createContext, useState, useContext } from "react"
import api from "../services/api"

const GrievanceContext = createContext()

export const GrievanceProvider = ({ children }) => {
  const [grievances, setGrievances] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchGrievances = async (filters = {}) => {
    try {
      setLoading(true)

      // Prepare API params
      const params = {}

      if (filters.status) params.status = filters.status
      if (filters.mandal) params.mandal = filters.mandal
      if (filters.area) params.area = filters.area
      if (filters.village) params.village = filters.village
      if (filters.booth) params.booth = filters.booth

      // Handle date filters
      if (filters.programDate) {
        params.programDate = filters.programDate
      } else if (filters.startDate && filters.endDate) {
        params.startDate = filters.startDate
        params.endDate = filters.endDate
      }

      const query = new URLSearchParams(params).toString()
      const res = await api.get(`/grievances?${query}`)
      setGrievances(res.data)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch grievances:", err)
      setError(err.response?.data?.message || "Failed to fetch grievances")
    } finally {
      setLoading(false)
    }
  }

  const createGrievance = async (grievanceData) => {
    try {
      setLoading(true)
      const res = await api.post("/grievances", grievanceData)
      setGrievances([...grievances, res.data])
      setError(null)
      return res.data
    } catch (err) {
      console.error("Failed to create grievance:", err)
      setError(err.response?.data?.message || "Failed to create grievance")
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateGrievance = async (id, grievanceData) => {
    try {
      setLoading(true)
      const res = await api.put(`/grievances/${id}`, grievanceData)
      setGrievances(grievances.map((grievance) => (grievance._id === id ? res.data : grievance)))
      setError(null)
    } catch (err) {
      console.error("Failed to update grievance:", err)
      setError(err.response?.data?.message || "Failed to update grievance")
    } finally {
      setLoading(false)
    }
  }

  const deleteGrievance = async (id) => {
    try {
      setLoading(true)
      await api.delete(`/grievances/${id}`)
      setGrievances(grievances.filter((grievance) => grievance._id !== id))
      setError(null)
    } catch (err) {
      console.error("Failed to delete grievance:", err)
      setError(err.response?.data?.message || "Failed to delete grievance")
    } finally {
      setLoading(false)
    }
  }

  return (
    <GrievanceContext.Provider
      value={{
        grievances,
        loading,
        error,
        fetchGrievances,
        createGrievance,
        updateGrievance,
        deleteGrievance,
      }}
    >
      {children}
    </GrievanceContext.Provider>
  )
}

export const useGrievance = () => {
  return useContext(GrievanceContext)
}
