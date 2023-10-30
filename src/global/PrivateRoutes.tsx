import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/FirebaseContext'
import {useState} from 'react'

// components

import Sidebar from '../components/nav/sidebar'
import Navbar from '../components/nav/navbar'
import BottomNavbar from '../components/nav/bottomNav'

export default function PrivateRoutes() {
  const { currentUser } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const setSidebarOpen = (value: boolean | ((prevState: boolean) => boolean)) => {
    setIsSidebarOpen(value);
  };

  return currentUser ? (
    <>
      <div className="z-[999] sidebar fixed">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <Navbar setSidebarOpen={setSidebarOpen} />
        <BottomNavbar />
      </div>
      {!isSidebarOpen && <div className='w-full mt-[12vh] lg:mt-[20px] lg:w-[67vw] lg:ml-[30vw]'>
        <Outlet />
        <div className='w-screen h-[150px] lg:h-[0px]'></div>
      </div>}
    </>
  ) : (
    <Navigate to="/login" />
  )
}
