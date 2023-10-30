import {Link} from 'react-router-dom'
import styles from '../global/styles'

const Sucess = () => {
  return (
    <div className="w-[100vw] flex flex-col items-center justify-center h-[100vh]">
      <div className="bg-content shadow-lg flex flex-col items-center justify-center gap-[50px] rounded-lg w-auto h-auto px-[50px] min-h-[50vh] py-[80px]">
        <p className="text-4xl font-bold font-playfair">
          Success !!
        </p>
        <p className="text-xl text-center">
          Booking Confirmed <br /> Please check your bookings page. 
        </p>
        <Link to={'/'} className={styles.primaryBtn} >
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default Sucess