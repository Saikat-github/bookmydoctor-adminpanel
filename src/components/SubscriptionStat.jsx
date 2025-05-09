import React from 'react'
import { BadgeCheck, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';



const SubscriptionStat = ({ subscription, docId }) => {
    const { orderId, plan, status, startDate, endDate } = subscription;
    const isStatusActive = status !== 'expired' ? true : false;


    return (
        <div className="max-w-md space-y-2">
            {!isStatusActive
                &&
                <p className='text-red-600  sm:text-sm text-xs'>
                    *Your subscription has expired on {new Date(endDate).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                    })}, please subscribe now to use all features
                </p>
            }
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2"> {isStatusActive ? "Subscription Details" : "Last Subscription"}
            </h2>

            <div className="space-y-4">
                <p className={`text-sm text-center font-medium px-3 py-1 rounded-full ${isStatusActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} w-24`}>
                    {status.toUpperCase()}
                </p>
                <div className="flex items-center gap-3 text-gray-600">
                    <BadgeCheck className="w-4 h-4" />
                    <span className="sm:text-sm text-xs">
                        <strong>Subscription ID:</strong> {orderId}
                    </span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="sm:text-sm text-xs">
                        <strong>Plan:</strong> {plan.charAt(0).toUpperCase() + plan.slice(1)}
                    </span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="sm:text-sm text-xs">
                        <strong>Start Date:</strong> {new Date(startDate).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                        })}
                    </span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="sm:text-sm text-xs">
                        <strong>End Date:</strong> {new Date(endDate).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                        })}
                    </span>
                </div>

                <Link to={`/doctor/payments/${docId}`} className='cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2  rounded-full hover:opacity-90 transition mx-auto text-center text-sm'>
                    See Payment History
                </Link>
            </div>
        </div>
    )
}

export default SubscriptionStat

