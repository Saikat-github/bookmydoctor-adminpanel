import { useContext, useState } from 'react';
import { AdminContext } from '../context/AdminContext';
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { CheckCircle, XCircle, CalendarDays, User, Stethoscope } from "lucide-react";
import { toast } from 'react-toastify'
import { SingleAppointment } from '../components';
import axios from 'axios';



const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loader, setLoader] = useState(false);

  const { docId } = useParams();
  const { doctors, backendUrl } = useContext(AdminContext);
  const { register, handleSubmit } = useForm();

  const [selectedDoc] = doctors.filter((doc) => doc._id === docId);


  const formatTime = (time) => {
    if (!time) return '';
    return new Date(`2025-02-09T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };


  const getAvailableDays = () => {
    if (!selectedDoc.availability?.workingDays) return [];
    return Object.entries(selectedDoc.availability?.workingDays).map(([day, slots]) => ({
      day,
      slots: Array.isArray(slots) ? slots.map(slot =>
        `${formatTime(slot.start)} - ${formatTime(slot.end)}`
      ) : []
    }));
  };



  const getAppointments = async (data) => {
    try {
      setLoader(true);
      const res = await axios.get(`${backendUrl}/api/admin/get-appointments`, {
        params: { date: data.date, docId },
        withCredentials: true
      });
      console.log(res.data);
      if (res.data.success) {
        setAppointments(res.data.appointments);
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

  if (!selectedDoc) return null;

  return (
    <div className='sm:p-4 flex gap-4 flex-col items-center my-4 '>
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl space-y-4">
        <div className="flex items-center justify-between gap-2 text-slate-800 text-sm">
          <p className='flex items-center gap-0.5'>
            {
              selectedDoc.verified
                ?
                <CheckCircle className="w-4 text-green-600" />
                :
                <XCircle className='w-4 text-red-600' />
            }
            Dr. {selectedDoc.personalInfo?.name}
          </p>
          <p className='flex items-center gap-0.5'>
            <Stethoscope className='w-4 text-indigo-600' />
            {selectedDoc.professionalInfo?.speciality}</p>
        </div>


        {/* Availability Section */}
        {selectedDoc.availability?.workingDays &&
          Object.keys(selectedDoc.availability.workingDays).length > 0 && (
            <div className="pt-1 border-t border-slate-200">
              <h3 className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <CalendarDays className="w-4 h-4 text-slate-600" />
                Available Time Slots
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 text-xs">
                {getAvailableDays().map(({ day, slots }) => (
                  <div
                    key={day}
                    className="pt-2"
                  >
                    <h4 className="text-slate-700 font-medium mb-1">{day}</h4>
                    <ul className="text-slate-600 space-y-1">
                      {slots.map((slot, index) => (
                        <li key={index}>{slot}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>


      {/* Form Section */}
      <form onSubmit={handleSubmit(getAppointments)} className="flex flex-col items-center">
        <div className="text-sm flex flex-col items-center gap-2 sm:gap-4 justify-center">
          <label

            htmlFor="appointment-date"
            className="text-gray-700 font-medium"
          >
            Please Select a Date
          </label>
          <input
            type="date"
            id="appointment-date"
            className="border border-slate-400 rounded py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all duration-300 shadow-sm"
            {...register("date", { required: true })}
            required
          />
          <button
            disabled={loader}
            type='submit'
            className={`px-4 py-2 rounded bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 cursor-pointer`}
          >
            {loader ? "Loading..." : "Get Appointments"}
          </button>
        </div>
      </form>


      {/* All appointments */}
      <div>
        {
          appointments
          &&
          appointments.map((appointment, idx) => (
            <SingleAppointment key={idx} appointment={appointment} />
          ))
        }
      </div>
    </div>
  )
}

export default DoctorAppointments