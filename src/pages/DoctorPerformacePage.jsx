import { useState, useContext, useEffect } from "react";
import { CalendarDays, TrendingUp, TrendingDown, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { getStartEndDate } from "../services/utilFunctions";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader2 } from "lucide-react";



const performanceFilters = ["Best Performing", "Worst Performing"];

const dummyDoctors = [
  {
    id: 1,
    name: "Dr. Ayesha Khan",
    specialization: "Cardiologist",
    appointments: 92,
  },
  {
    id: 2,
    name: "Dr. Ravi Mehta",
    specialization: "Dermatologist",
    appointments: 12,
  },
  {
    id: 3,
    name: "Dr. Sneha Patel",
    specialization: "Neurologist",
    appointments: 58,
  },
];

export default function DoctorPerformancePage() {
  const { dateFilter, setDateFilter, currentAdmin, backendUrl, accounts, setAccounts } = useContext(AdminContext);
  const [selectedPerformance, setSelectedPerformance] = useState("Best Performing");
  const [loader, setLoader] = useState(false);
  const [results, setResults] = useState([]);


  const getPerformanceData = async () => {
    try {
      setLoader(true);
      const { startDate, endDate } = getStartEndDate(dateFilter);
      const res = await axios.get(backendUrl + '/api/admin/top-doctors', {
        params: {
          startDate,
          endDate,
          bestPerforming: selectedPerformance === "Best Performing" ? true : false,
        },
        withCredentials: true,
      })
      if (res.data.success) {
        setResults(res.data.topDoctors);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  }


  useEffect(() => {
    getPerformanceData();
  }, [dateFilter, selectedPerformance, currentAdmin]);



  return (
    <div className="px-2 sm:px-10 py-4 space-y-4">
      <h1 className="text-lg md:text-2xl font-medium text-slate-700 text-center">Doctor Performance</h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6 text-sm">
        {/* Date Filter */}
        <div className="flex flex-row-reverse items-center gap-2">
          <div className="flex border border-gray-300 rounded-lg px-2 py-1 text-gray-700 bg-white">
            <select
              className="outline-none"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">Filter</option>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="lastWeek">Last Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
              <option value="lastYear">Last Year</option>
            </select>
            <CalendarDays className=" text-gray-400 w-5" />
          </div>
          {loader && <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />}
        </div>

        {/* Performance Filter */}
        <div className="flex gap-2 justify-center">
          {performanceFilters.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedPerformance(option)}
              className={`px-3 py-1.5 rounded-full text-sm border ${selectedPerformance === option
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <hr className="text-slate-400" />


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.length > 0 && results.map((doctor) => (
          <div key={doctor.doctorId} className="px-2 sm:px-4 py-2 border border-slate-400 rounded-xl shadow-sm bg-white space-y-2 text-xs md:text-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">{doctor?.name}</h3>
                <p className=" text-gray-500">{doctor?.specialization}</p>
              </div>
              {selectedPerformance === "Best Performing" ? (
                <TrendingUp className="text-green-600" size={20} />
              ) : (
                <TrendingDown className="text-red-500" size={20} />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className=" text-gray-600">Appointments</span>
              <span className="text-base font-semibold text-indigo-600">{doctor?.totalSerials}</span>
            </div>
            <div className="flex gap-2 items text-xs">
              <Link to={`/profiles/${doctor.doctorId}`} className="border flex items-center gap-1 px-3 py-1.5 rounded-lg text-indigo-600 transition-all duration-200 cursor-pointer hover:bg-indigo-600 hover:text-white">
                <Eye size={16} />
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
