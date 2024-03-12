import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png'
import styles from '../../global/styles'
import {useEffect, useState} from 'react'

import {useAuth} from "../../contexts/FirebaseContext"

const Sidebar = ({isSidebarOpen, setSidebarStatus}: any) => {

  console.log(isSidebarOpen)
  const {logout} = useAuth()

  const [shouldShowSidebar, setShouldShowSidebar] = useState(window.innerWidth > 1024);
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1];

  useEffect(() => {
    const handleResize = () => {
      setShouldShowSidebar(window.innerWidth > 1024);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles.sidebar} style={shouldShowSidebar ? {} : !isSidebarOpen ? {transform: 'translateY(-100vh)'} : {}}>
      <div className="p-4 hidden lg:flex mt-[30px] items-center bg-white rounded-lg w-full shadow-lg">
        <img src={logo} alt="Logo" className="w-[40px] h-auto rounded-[50%] mr-2" />
        <span className="font-playfair text-2xl font-bold">Vedapurohith</span>
      </div>
      <nav className="flex-1 flex flex-col overflow-auto no-wrap py-4 mt-auo mb-auto justify-start w-full">
        <Link to="/" onClick={() => setSidebarStatus(false)} className={"sidebar-item " + (currentPath === '' ? styles.activeSidebarItem : styles.sidebarItem)}>Home</Link>
        <Link to="/poojas" onClick={() => setSidebarStatus(false)} className={"sidebar-item " + (currentPath === 'poojas' ? styles.activeSidebarItem : styles.sidebarItem)}>Poojas</Link>
        <Link to="/bookings" onClick={() => setSidebarStatus(false)} className={"sidebar-item " + (currentPath === 'bookings' ? styles.activeSidebarItem : styles.sidebarItem)}>Bookings</Link>
        <Link to="/poojas" onClick={() => setSidebarStatus(false)} className={"sidebar-item " + (currentPath === 'edit-poojas' ? styles.activeSidebarItem : styles.sidebarItem)}>Edit Poojas</Link>
        <Link to="/add-poojas" onClick={() => setSidebarStatus(false)} className={"sidebar-item " + (currentPath === 'add-poojas' ? styles.activeSidebarItem : styles.sidebarItem)}>Add Poojas</Link>
        <Link to="/messages" onClick={() => setSidebarStatus(false)} className={"sidebar-item " + (currentPath === 'messages' ? styles.activeSidebarItem : styles.sidebarItem)}>Messages</Link>
        <Link to="/" onClick={() => {setSidebarStatus(false); logout()}} className={"sidebar-item " + (currentPath === 'messages' ? styles.activeSidebarItem : styles.sidebarItem)}>Logout</Link>
      </nav>
    </div>
  )
}

export default Sidebar