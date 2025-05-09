import React from "react";


const SingleAppointment = ({ appointment }) => {
  const { allPatients, appointmentDate, totalSerialNumber, doctorId, _id } = appointment;

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg shadow-slate-500 rounded-xl overflow-hidden my-5">
      <div className="px-6 py-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-gray-800">Total Appointments : {totalSerialNumber}</h2>
        </div>

        {/* Appointment Date */}
        <p className="text-gray-600 text-sm mb-4">
          Appointment Date:{" "}
          <span className="text-gray-800">
            {new Date(appointmentDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </p>

        {/* Patients Section */}
        <div>
          <h3 className="text-sm text-gray-800 mb-2">Patients:</h3>
          <ul className="space-y-2 text-xs">
            {allPatients.map((patient, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-4 py-2 border-b border-b-slate-500"
              >
                <span className="text-gray-700">{patient.patientName || "Unknown Patient"} <br />Ph : {patient.phoneNumber || "N/A"} <br />
                  Serial : {patient.serialNumber}</span>

                <p className={`border border-slate-500 px-3 py-1 ${patient.status === "BOOKED" ? "text-slate-800" : "text-green-600"}`}>
                  {patient.status}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SingleAppointment;
