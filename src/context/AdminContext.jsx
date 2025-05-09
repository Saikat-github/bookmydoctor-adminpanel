import { createContext, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { getStartEndDate } from '../services/utilFunctions';


export const AdminContext = createContext()


const AdminContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [loader, setLoader] = useState(false);
    const [dashData, setDashData] = useState({});
    const [dateFilter, setDateFilter] = useState("thisMonth");
    const [doctors, setDoctors] = useState([]);
    const [accounts, setAccounts] = useState([]);



    const checkAuthStatus = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/admin/current_user', {
                withCredentials: true
            });
            if (response.data.success) {
                // User is logged in
                setCurrentAdmin(true)
                return true;
            } else {
                // User is not logged in
                setCurrentAdmin(false);
                return false;
            }
        } catch (error) {
            return false;
        }
    }









    return (
        <AdminContext.Provider value={{ currentAdmin, setCurrentAdmin, loader, backendUrl, checkAuthStatus, dashData, setDashData, dateFilter, setDateFilter, doctors, setDoctors, accounts, setAccounts }}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;