import styles from "../../global/styles"
import logo from '../../assets/logo.png'

import {useState} from 'react'

const Navbar = ({setSidebarOpen}) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.navbar}>
      <img src={logo} alt="Logo" className="w-[30px] h-auto rounded-[50%] mr-2" />
      <span className="font-playfair text-xl font-bold mr-auto">Vedapurohith</span>
      <div className="w-[50px] h-[50px] flex flex-col items-center justify-center p-[10px] bg-gray-100 rounded-lg cursor-pointer text-black">
        <i className='bx bxs-bell text-xl rotate-[0deg]'></i>
      </div>
      <div onClick={toggleSidebar} className="w-[50px] h-[50px] ml-[10px] flex flex-col items-center justify-center p-[10px] bg-gray-100 rounded-lg cursor-pointer">
        <i className='bx bx-menu-alt-right text-2xl'></i>
      </div>
    </div>
  )
}

export default Navbar