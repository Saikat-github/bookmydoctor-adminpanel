import {
  UserCheck,
  UserX,
  Users,
  ArrowRight,
  CalendarDays,
  Loader2
} from "lucide-react";
import { useContext } from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from 'react-toastify'
import { AdminContext } from "../context/AdminContext";
import { getStartEndDate } from "../services/utilFunctions";
import axios from "axios";


export default function Dashboard() {
  const [loader, setLoader] = useState(false);
  const location = useLocation();
  const { dashData, dateFilter, setDateFilter, currentAdmin, backendUrl, setDashData } = useContext(AdminContext);


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success');
    const message = params.get('message');

    if (success === 'true') {
      toast.success(message)
    }
  }, [location]);

  useEffect(() => {
    const getDashData = async () => {
      setLoader(true);
      try {
        const { startDate, endDate } = getStartEndDate(dateFilter);
        const res = await axios.get(backendUrl + '/api/admin/dashdata', {
          params: {
            startDate,
            endDate
          },
          withCredentials: true,
        })
        if (res.data.success) {
          setDashData(res.data.dashData);
        } else {
          toast.error(res.data.message)
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setLoader(false);
      }
    }

    getDashData()
  }, [dateFilter, currentAdmin]);


  return (
    <div className="px-2 sm:px-10 py-4 space-y-6">
      <h1 className="text-lg md:text-2xl font-medium text-slate-700 text-center">Dashboard</h1>
      <div className="flex justify-center items-center gap-2">
        {/* Filter Dropdown */}
        <div className="text-sm flex border border-gray-300 rounded-lg px-2 py-1 text-gray-700 bg-white">
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


      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Total Doctors */}
        <Link
          to="/profiles"
          className="p-4 rounded-xl flex justify-start gap-4 items-center shadow-xl group transition max-sm:text-sm"
        >
          <div className="flex items-center gap-4">
            <UserCheck className="text-blue-600" />
            <div>
              <p className="text-blue-800">Doctor Profiles</p>
              <p className="text-blue-700">{dashData?.totalProfiles}</p>
            </div>
          </div>
          <ArrowRight className="text-blue-500 group-hover:translate-x-1 transition" />
        </Link>


        {/* Registered Users */}
        <Link
          to="/accounts"
          className=" p-4 rounded-xl flex justify-start gap-4 items-center shadow-xl group transition max-sm:text-sm"
        >
          <div className="flex items-center gap-4">
            <Users className="text-green-600" />
            <div>
              <p className="text-green-800">Registered Doc Accounts</p>
              <p className="text-green-700">{dashData?.totalRegisteredDocs}</p>
            </div>
          </div>
          <ArrowRight className="text-green-500 group-hover:translate-x-1 transition" />
        </Link>


        {/* Unverified Doctors */}
        <div
          className=" p-4 rounded-xl flex justify-start gap-4 items-center shadow-xl group transition max-sm:text-sm"
        >
          <div className="flex items-center gap-4">
            <UserX className="text-red-600" />
            <div>
              <p className="text-red-800">Unverified Doctors</p>
              <p className="text-red-700">{dashData?.unverifiedProfiles}</p>
            </div>
          </div>
        </div>

        {/* Verified Doctors */}
        <div
          className=" p-4 rounded-xl flex justify-start gap-4 items-center shadow-xl group transition max-sm:text-sm"
        >
          <div className="flex items-center gap-4">
            <UserCheck className="text-purple-600" />
            <div>
              <p className="text-purple-800">Verified Doctors</p>
              <p className="text-purple-700">{dashData?.verifiedProfiles}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
