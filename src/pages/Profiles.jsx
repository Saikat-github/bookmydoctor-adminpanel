import {
  Search,
  CalendarDays,
  ShieldCheck,
  ArrowRight,
  X,
  Loader2,
  Eye
} from "lucide-react";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify'
import { AdminContext } from "../context/AdminContext";
import { getStartEndDate } from "../services/utilFunctions";
import axios from "axios";
import { useEffect } from "react";




export default function Profiles() {
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);

  const { dateFilter, setDateFilter, currentAdmin, backendUrl, doctors, setDoctors } = useContext(AdminContext);


  const getAllProfilesData = async () => {
    try {
      setLoader(true);
      const { startDate, endDate } = getStartEndDate(dateFilter);
      const res = await axios.get(backendUrl + '/api/admin/all-profiles', {
        params: {
          name: search,
          startDate,
          endDate,
          cursor
        },
        withCredentials: true,
      })
      if (res.data.success) {
        setDoctors(cursor ? [...doctors, ...res.data.doctors] : res.data.doctors)
        setCursor(res.data.nextCursor);
        setHasNextPage(res.data.hasNextPage);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  }


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getAllProfilesData();
    }, 500); // 500ms debounce delay

    return () => clearTimeout(delayDebounceFn); // Cleanup the timeout on dependency change
  }, [search, dateFilter]);



  return (
    <div className="px-2 sm:px-6 py-4 space-y-2">
      <h1 className="text-lg md:text-2xl font-medium text-slate-700 text-center">Doctor Profiles</h1>
      {/* Search */}

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 pb-4 text-sm">
        <div className="w-full md:w-80 border border-slate-300 rounded-lg px-1 sm:px-4 py-1 flex items-center">
          <Search className="text-slate-500 w-5" />
          <input
            type="text"
            placeholder="Search doctors by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full ml-2 outline-none"
          />
          <X onClick={() => setSearch("")} className={`text-slate-500 w-5 cursor-pointer ${search !== "" ? "block" : "hidden"}`} />
        </div>
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
      <hr className="text-slate-400 mb-4" />

      {/* Doctors List */}
      <div className="flex flex-col items-center gap-4">
        {doctors.length > 0 ? (
          doctors.map((doc) => (
            <div
              key={doc._id}
              className="p-2 sm:p-4 rounded bg-white border border-slate-400 flex items-center justify-between w-full md:w-1/2 transition-all duration-200 max-sm:text-xs group text-slate-700"
            >
              <div className="space-y-1">
                <p className=" text-slate-800 flex items-center gap-1 text-sm">
                  Dr. {doc.personalInfo.name}
                  <ShieldCheck
                    className={`w-4 sm:w-5 ${doc.verified
                      ? "text-green-600"
                      : "text-red-500"
                      }`}
                  />
                </p>
                <p className="text-xs">
                  {doc.professionalInfo?.speciality}, {doc.clinicInfo?.city}
                </p>
                <p
                  className={`text-xs ${doc.verified
                    ? "text-green-600"
                    : "text-red-500"
                    }`}
                >
                  {doc.verified ? "Verified" : "Unverified"}
                </p>
                <div>
                  <div className="flex gap-2 items text-xs">
                    <Link to={`/profiles/${doc._id}`}
                      className="border flex items-center gap-1 px-3 py-1.5 rounded-lg text-indigo-600 transition-all duration-200 cursor-pointer hover:bg-indigo-600 hover:text-white">
                      <Eye size={16} />
                      View Profile
                    </Link>
                    <Link
                      to={`/appointments/${doc._id}`}
                      className="border border-slate-400 flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-800 hover:text-white hover:bg-slate-800 transition-all duration-200 cursor-pointer">
                      <Eye size={16} />
                      View Appointments
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-500">No doctors found.</p>
        )}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <button
          disabled={loader}
          className="bg-indigo-700 mx-auto text-white px-4 py-2 rounded-lg mt-4 flex items-center gap-2 cursor-pointer"
          onClick={() => getAllProfilesData()}
        >
          {loader ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
