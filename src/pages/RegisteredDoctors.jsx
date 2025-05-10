import { CalendarDays, Eye, Search, Trash2, X, Loader2 } from "lucide-react";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify'
import { AdminContext } from "../context/AdminContext";
import { getStartEndDate } from "../services/utilFunctions";
import axios from "axios";
import { useEffect } from "react";
import ConfirmationModal from "../components/ConfirmationModal";



export default function RegisteredDoctors() {
  const { dateFilter, setDateFilter, currentAdmin, backendUrl, accounts, setAccounts } = useContext(AdminContext);
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [docId, setDocId] = useState(null);


  const deleteAccount = async (docId) => {
    try {
      setLoader(true);
      const { data } = await axios.post(backendUrl + '/api/admin/delete-docaccount', {
        docId
      },
        {
          withCredentials: true
        });
      if (data.success) {
        toast.success(data.message);
        setIsOpen(false);
        getAllAccountsData()
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoader(false);
    }
  }



  const getAllAccountsData = async () => {
    try {
      setLoader(true);
      const { startDate, endDate } = getStartEndDate(dateFilter);
      const res = await axios.get(backendUrl + '/api/admin/all-accounts', {
        params: {
          search,
          startDate,
          endDate,
          cursor
        },
        withCredentials: true,
      })
      console.log(res.data);
      if (res.data.success) {
        setAccounts(cursor ? [...accounts, ...res.data.docAccounts] : res.data.docAccounts)
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
      getAllAccountsData()
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, dateFilter, currentAdmin]);



  return (
    <div className="px-2 sm:px-10 py-4 space-y-4">
      <h1 className="text-lg md:text-2xl font-medium text-slate-700 text-center">Registered Accounts</h1>
      {/* Header and Time Filter */}
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


      <hr className="text-slate-400" />


      {/* Doctor List */}
      <div className="grid grid-cols-1 gap-4">
        {accounts.length > 0 ? (
          accounts.map((doc) => (
            <div
              key={doc._id}
              className="border border-slate-400 rounded-xl bg-white p-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
            >
              <div className="space-y-1 text-xs md:text-sm">
                <p className="text-slate-800 font-semibold">{doc.email}</p>
                <p className="text-slate-600">Created At: {doc.createdAt && new Date(doc.createdAt).toLocaleString('en-GB')}</p>
                <p className="text-slate-600">Updated At: {doc.updatedAt && new Date(doc.updatedAt).toLocaleString('en-GB')}</p>
                <p className="text-slate-600">
                  Signup Method:
                  <span className="font-medium"> {doc.googleId ? "Google" : "Email OTP"}</span>
                </p>
              </div>
              <div className="flex flex-col gap-2 text-xs md:text-sm">
                <Link
                  disabled={doc.profileCompleted}
                  to={doc.profileId && `/profiles/${doc.profileId}`} className="border flex items-center gap-1 px-3 py-1.5 rounded-lg text-indigo-600 transition-all duration-200 cursor-pointer hover:bg-indigo-600 hover:text-white">
                  <Eye size={16} />
                  View Profile
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setDocId(doc._id)
                  }}
                  className="border md:mt-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-600 cursor-pointer hover:text-white hover:bg-red-600 transition-all duration-200">
                  <Trash2 size={16} />
                  Terminate
                </button>
                <ConfirmationModal
                  isOpen={isOpen}
                  message="Account"
                  onConfirm={() => deleteAccount(docId)}
                  onCancel={() => setIsOpen(false)}
                  loader={loader}
                />

              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-500 text-center">No registered doctors found.</p>
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
