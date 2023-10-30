import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png'
import styles from '../../global/styles'
import {useEffect, useState} from 'react'

const Sidebar = ({isSidebarOpen}) => {

  console.log(isSidebarOpen)

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
        <Link to="/" className={"sidebar-item " + (currentPath === '' ? styles.activeSidebarItem : styles.sidebarItem)}>Home</Link>
        <Link to="/poojas" className={"sidebar-item " + (currentPath === 'poojas' ? styles.activeSidebarItem : styles.sidebarItem)}>Poojas</Link>
        <Link to="/items" className={"sidebar-item " + (currentPath === 'items' ? styles.activeSidebarItem : styles.sidebarItem)}>Pooja Items</Link>
        <Link to="/bookings" className={"sidebar-item " + (currentPath === 'bookings' ? styles.activeSidebarItem : styles.sidebarItem)}>Bookings</Link>
        {/* <Link to="/support" className={"sidebar-item " + (currentPath === 'support' ? styles.activeSidebarItem : styles.sidebarItem)}>Support</Link> */}
        <Link to="/messages" className={"sidebar-item " + (currentPath === 'messages' ? styles.activeSidebarItem : styles.sidebarItem)}>Messages</Link>
        {/* <Link to="/notifications" className={"sidebar-item " + (currentPath === 'notifications' ? styles.activeSidebarItem : styles.sidebarItem)}>Notifications</Link>
        <Link to="/profile" className={"sidebar-item " + (currentPath === 'profile' ? styles.activeSidebarItem : styles.sidebarItem)}>Profile</Link> */}
      </nav>
    </div>
  )
}

export default Sidebar