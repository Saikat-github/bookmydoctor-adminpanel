import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Dashboard, DoctorAppointments, DoctorPerformancePage, Login, NotFound, Payments, Profiles, RegisteredDoctors, SingleProfile } from './pages/index.js'
import AdminContextProvider from './context/AdminContext.jsx'
import ProtectedDocRoute from './components/ProtectedDocRoute.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ProtectedDocRoute>
          <Dashboard />
        </ProtectedDocRoute>
      },
      {
        path: "/profiles",
        element: <ProtectedDocRoute>
          <Profiles />
        </ProtectedDocRoute>
      },
      {
        path: "/profiles/:id",
        element: <ProtectedDocRoute>
          <SingleProfile />
        </ProtectedDocRoute>
      },
      {
        path: "/accounts",
        element: <ProtectedDocRoute>
          <RegisteredDoctors />
        </ProtectedDocRoute>
      },
      {
        path: "/performance",
        element: <ProtectedDocRoute>
          <DoctorPerformancePage />
        </ProtectedDocRoute>
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/doctor/payments/:docId",
        element: <Payments />
      },
      {
        path: "/appointments/:docId",
        element: <DoctorAppointments />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  },
])



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminContextProvider>
      <RouterProvider router={router} />
    </AdminContextProvider>
  </StrictMode>,
)
