import React from 'react'
import { Footer, Navbar, ScrollToTop } from './components'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'



const App = () => {
  return (
    <div className='font-family-outfit'>
      <Navbar />
      <ToastContainer />
      <main className='min-h-screen'>
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App