import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { DoctorProfileCard } from '../components';
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';




const SingleProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctorData, setDoctorData] = useState([]);
  const [loader, setLoader] = useState(false);
  const { backendUrl } = useContext(AdminContext);



  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoader(true);
        const response = await axios.get(`${backendUrl}/api/admin/get-doctor`, {
          withCredentials: true,
          params: { doctorId: id }
        })
        if (response.data.success) {
          setDoctorData(response.data.profileData);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error('Error fetching doctor data:', error);
      } finally {
        setLoader(false);
      }
    };

    fetchDoctorData();
  }, [])


  if (loader) {
    return (
      <div className='flex justify-center my-36 h-screen'>
        <Loader2 className='animate-spin text-indigo-700 h-8 w-8' />
      </div>
    )
  }

  return (
    <div className='my-10'>
      {
        doctorData.length === 0 ? (
          <h1 className='text-2xl my-20 text-slate-700 text-center'>No Doctor Found</h1>
        ) : (
          <DoctorProfileCard doctorData={doctorData} />
        )
      }
    </div>
  )
}

export default SingleProfile