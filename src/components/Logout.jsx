import React, { useContext, useState } from 'react'
import { LogOut, LogIn, Loader } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';



const Logout = ({setIsMobileMenuOpen}) => {
    const [loader, setLoader] = useState(false);
    const {currentAdmin, setCurrentAdmin, backendUrl} = useContext(AdminContext);
    const navigate = useNavigate()

    const handleLogout = async () => {
        setLoader(true);
        try {
            const res = await axios.post(backendUrl + '/api/admin/logout', {}, { withCredentials: true });  
            if (res.data.success) {
                setCurrentAdmin(false)
                toast.success(res.data.message)
                navigate("/login")
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            if (setIsMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
            setLoader(false);
        }
    }

    return (
        <div>
            {
                currentAdmin
                    ?
                    <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 cursor-pointer">
                        <LogOut className='w-4' />
                        {loader ? <Loader className="animate-spin w-4" /> : "Logout"}
                    </button>
                    :
                    <button
                        onClick={() => {
                            if (setIsMobileMenuOpen) {
                                setIsMobileMenuOpen(false);
                            }
                            navigate("/login")
                        }}
                        className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 cursor-pointer">
                        <LogIn className='w-4' />
                        Login
                    </button>
            }
        </div>
    )
}

export default Logout