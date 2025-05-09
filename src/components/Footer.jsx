import React from 'react'
import { Link } from 'react-router-dom'


const Footer = () => {
  return (
    <div className="bg-gray-100 p-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-700 mt-20">
      <p className='text-2xl sm:block bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent'>
        bookmydoctor.
      </p>
      <div className="flex flex-col md:flex-row gap-4 items-center text-xs text-blue-600">
        <Link to="/" className="hover:text-blue-600">Frontend Panel</Link>
        <Link to="/doctor" className="hover:text-blue-600">Doctor Panel</Link>
        <span className="text-gray-500">📞 +91-9876543210</span>
      </div>
    </div>
  )
}

export default Footer