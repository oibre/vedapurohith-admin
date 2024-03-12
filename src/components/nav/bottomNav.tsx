import styles from "../../global/styles"
import logo from '../../assets/logo.png'
import {Link, useLocation} from 'react-router-dom'

const BottomNavbar = () => {
  
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1];

  return (
    <div className={styles.bottomNavbar}>
      <Link to={'/'} className={"flex-1 " + (currentPath === '' ? styles.activeBottomNavItem : styles.bottomNavItem)}>
        <i className='bx bxs-home-alt-2 text-md'></i>
        <p className="font-playfair text-xs">Home</p>
      </Link>
      <Link to={'/poojas'} className={"flex-1 " + (currentPath === 'poojas' ? styles.activeBottomNavItem : styles.bottomNavItem)}>
        <i className='bx bx-health text-md'></i>
        <p className="font-playfair text-xs">Poojas</p>
      </Link>
      <Link to={'/bookings'} className={"flex-1 " + (currentPath === 'bookings' ? styles.activeBottomNavItem : styles.bottomNavItem)}>
        <i className='bx bxs-cart text-lg mb-[-6px]'></i>
        <p className="font-playfair text-xs">Bookings</p>
      </Link>
      {/* <Link to={'/messages'} className={"flex-1 " + (currentPath === 'messages' ? styles.activeBottomNavItem : styles.bottomNavItem)}>
        <i className='bx bxs-home-alt-2 text-md'></i>
        <p className="font-playfair text-xs">Messages</p>
      </Link> */}
    </div>
  )
}

export default BottomNavbar
