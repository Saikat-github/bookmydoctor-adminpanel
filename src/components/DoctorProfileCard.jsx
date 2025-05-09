import React, { useContext, useState } from 'react';
import {
    Phone,
    MapPin,
    Languages,
    IndianRupee,
    GraduationCap,
    Clock,
    Building,
    Stethoscope,
    Mail,
    BadgeCheck,
    CalendarDays,
    BadgeInfo

} from 'lucide-react';
import SubscriptionStat from './SubscriptionStat';
import ActionButtons from './utils/ActionButtons';


const DoctorProfileCard = ({ doctorData }) => {



    if (!doctorData) {
        return (
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <p className="text-slate-700">No doctor information available</p>
            </div>
        );
    }

    const {
        _id,
        personalInfo = {},
        professionalInfo = {},
        clinicInfo = {},
        availability = { workingDays: {} }
    } = doctorData;

    const formatTime = (time) => {
        if (!time) return '';
        return new Date(`2025-02-09T${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };


    const getAvailableDays = () => {
        if (!availability.workingDays) return [];
        return Object.entries(availability.workingDays).map(([day, slots]) => ({
            day,
            slots: Array.isArray(slots) ? slots.map(slot =>
                `${formatTime(slot.start)} - ${formatTime(slot.end)}`
            ) : []
        }));
    };


    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg pb-4">
            <div className="space-y-2 flex flex-col items-center">
                <img
                    src={personalInfo.image || '/api/placeholder/128/128'}
                    alt={personalInfo.name || 'Doctor'}
                    className="w-32 h-32 rounded-full object-cover bg-gradient-to-r from-indigo-500 to-purple-600"
                />
                <h2 className="text-2xl font-bold text-slate-700 flex gap-1 items-center">
                    Dr. {personalInfo.name || 'Name Not Available'}
                </h2>
                {
                    doctorData.verified
                        ?
                        <p className='text-green-700 font-medium'>(Verified)</p>
                        :
                        <p className='text-red-600 font-medium'>(Not Verified)</p>
                }
            </div>



            {/* More Details */}
            <div className="p-6 space-y-6 text-xs sm:text-sm">
                <div className="flex flex-col gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4 text-slate-700">
                        <h3 className="text-lg font-semibold text-slate-800">Profile Details</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-700">
                                <Mail className="w-5" />
                                <a href={`mailto:${personalInfo.email}`} className="text-indigo-600">
                                    {personalInfo.email}
                                </a>
                            </div>

                            {clinicInfo.phoneNumber && (
                                <div className="flex items-center gap-2 text-slate-700">
                                    <Phone className="w-5" />
                                    <a href={`tel:${clinicInfo.phoneNumber}`} className="text-indigo-600">
                                        {clinicInfo.phoneNumber}
                                    </a>
                                </div>
                            )}

                            <div className='flex items-center gap-2'>
                                <Stethoscope className='w-5' />
                                {professionalInfo.speciality || 'Specialty Not Available'}
                            </div>
                            <div className="flex items-center gap-2">
                                <GraduationCap className='w-5' />
                                <span>
                                    {professionalInfo.degree || 'Degree Not Available'}
                                    {professionalInfo.experience && ` • ${professionalInfo.experience} years experience`}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BadgeInfo className='w-5' />
                                <span>Registration Num: {professionalInfo.regNumber ? professionalInfo.regNumber : "Reg No not provided"}</span>
                            </div>
                            {professionalInfo.licenseDocument && (
                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="w-5" />
                                    <a
                                        href={professionalInfo.licenseDocument}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline text-indigo-600"
                                    >
                                        View License Document
                                    </a>
                                </div>
                            )}
                            <div className='flex items-center gap-2'>
                                <CalendarDays className='w-5' />
                                <p>DOB: {new Date(personalInfo.dob).toLocaleString('en-GB')}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className='w-5' />
                                <span>Profile Created: {new Date(doctorData?.createdAt).toLocaleString('en-GB')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className='w-5' />
                                <span>Profile Updated: {new Date(doctorData?.updatedAt).toLocaleString('en-GB')}</span>
                            </div>
                            {doctorData.about && (
                                <div className="flex items-center gap-2 text-slate-700">
                                    <Clock className='w-5' />
                                    <span>Average Consultation: {doctorData.about} mins</span>
                                </div>
                            )}
                        </div>
                    </div>



                    {/* Consultation Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800">Consultation Details</h3>
                        <div className="space-y-3">
                            {
                                availability.isAvailable

                                    ?
                                    <div className='flex items-center gap-2 text-green-600'>
                                        <p className='w-4 h-4 bg-green-600 rounded-full'></p>
                                        <p>Available</p>
                                    </div>
                                    :
                                    <div className='flex items-center gap-2 text-red-500'>
                                        <p className='w-4 h-4 bg-red-500 rounded-full'></p>
                                        <p>Not Available</p>
                                    </div>
                            }
                            {clinicInfo.fees !== undefined && (
                                <div className="flex items-center gap-2 text-slate-700">
                                    <IndianRupee className='w-5' />
                                    <span>Consultation Fee: ₹{clinicInfo.fees}</span>
                                </div>
                            )}
                            {clinicInfo.avgCheckTime && (
                                <div className="flex items-center gap-2 text-slate-700">
                                    <Clock className='w-5' />
                                    <span>Average Consultation: {clinicInfo.avgCheckTime} mins</span>
                                </div>
                            )}
                            {clinicInfo.maxAppointment && (
                                <div className="flex items-center gap-2 text-slate-700">
                                    <Clock className='w-5' />
                                    <span>Max Daily Appoinments: {clinicInfo.maxAppointment}</span>
                                </div>
                            )}
                            {personalInfo.language && personalInfo.language.length > 0 && (
                                <div className="flex items-center gap-2 text-slate-700">
                                    <Languages className='w-5' />
                                    <span>Languages: {personalInfo.language.join(', ')}</span>
                                </div>
                            )}
                        </div>
                    </div>



                    {/* Contact & Location */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800">Location</h3>
                        <div className="space-y-3">
                            {clinicInfo.city && (
                                <div className="flex items-center gap-2 text-slate-700">
                                    <Building className='w-5' />
                                    <span>{clinicInfo.city}, {clinicInfo.pincode}</span>
                                </div>
                            )}
                            {clinicInfo.address && (
                                <div className="flex items-center gap-2 text-slate-700">
                                    <MapPin className='w-5' />
                                    <span>{clinicInfo.address}, {clinicInfo.pincode}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>



                {/* Availability Schedule */}
                {availability.workingDays && Object.keys(availability.workingDays).length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Available Time Slots</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                            {getAvailableDays().map(({ day, slots }) => (
                                <div key={day} className="p-4">
                                    <h4 className="font-medium text-slate-800 mb-2">{day}</h4>
                                    {slots.map((slot, index) => (
                                        <div key={index} className="text-slate-600">
                                            {slot}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>




            {/* Subscription Details */}
            <div className="flex flex-col px-6">
                <SubscriptionStat subscription={doctorData?.subscription} docId={doctorData._id} />

                <hr className='my-6 text-slate-500' />

                <ActionButtons docId={doctorData?._id} verified={doctorData?.verified}/>
            </div>
        </div>
    );
};

export default DoctorProfileCard;