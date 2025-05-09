import { useState, useContext } from 'react';
import {useNavigate} from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext';
import ConfirmationModal from '../ConfirmationModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Loader2, Trash2 } from 'lucide-react';

const ActionButtons = ({docId, verified}) => {
    const [loading, setLoading] = useState(false);
    const { backendUrl } = useContext(AdminContext);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();


    const deleteProfile = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/delete-profile', {
                docId
            },
                {
                    withCredentials: true
                });
            if (data.success) {
                toast.success(data.message);
                setIsOpen(false);
                navigate("/profiles")
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }


    const changeVerificatonStatus = async () => {
        try {
            setLoading(true);
            const res = await axios.post(backendUrl+"/api/admin/change-verification", {docId}, {withCredentials: true})
            if (res.data.success) {
                toast.success(res.data.message)
                navigate(`/profiles`)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }


    return (
            <div className="space-y-2 text-sm px-2">
                <button
                    onClick={() => setIsOpen(true)}
                    className='cursor-pointer border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-4 py-1  rounded-full hover:opacity-90 transition duration-300 justify-center text-center flex items-center gap-1'>
                    <Trash2 className='w-4' />
                    Delete Profile
                </button>
                <ConfirmationModal
                    isOpen={isOpen}
                    message="Profile"
                    onConfirm={deleteProfile}
                    onCancel={() => setIsOpen(false)}
                    loader={loading}
                />
                <button 
                disabled={loading}
                onClick={changeVerificatonStatus}
                className='cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2  rounded-full hover:opacity-90 transition flex items-center gap-1 text-center'>
                    Mark as {verified ? "Unverified" : "Verified"} 
                    {loading && <Loader2 className='w-4 animate-spin' />}
                </button>
            </div>
            )
}

            export default ActionButtons