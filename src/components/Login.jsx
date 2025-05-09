import React, { useContext } from 'react'
import { toast } from 'react-toastify';
import { AdminContext } from '../context/AdminContext';
import GoogleLogo from '../assets/google2.svg';


const Login = () => {
  const { backendUrl, setCurrentAdmin } = useContext(AdminContext);
  const handleGoogleLogin = () => {
    window.location.href = `${backendUrl}/api/admin/google`;
  };


  return (
    <div className="oauth flex flex-col gap-4 items-center">
      <p className='text-xl text-slate-700 font-semibold'>Admin Login</p>
      <button
        onClick={handleGoogleLogin}
        className="hover:ring-1 hover:ring-indigo-700 w-60 py-3 flex gap-2 justify-center items-center shadow-lg rounded-lg transition-all duration-300 cursor-pointer"
      >
        <img className="w-8" src={GoogleLogo} alt="google-logo" />
        Login With Google
      </button>
    </div>
  )
}

export default Login