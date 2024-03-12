import {useNavigate} from 'react-router-dom'
import styles from '../global/styles'

const PoojaCard = ({pooja}: any) => {
  
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg p-6 cursor-pointer hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-103" key={pooja.id}>
      <h2 className="text-lg lg:text-xl font-playfair font-semibold mb-2">{pooja?.name}</h2>
      <p className='text-md lg:text-lg font-playfair'>Duration: {pooja?.duration}</p>
      <p className='text-md lg:text-lg font-playfair'>Price: {pooja?.price} INR</p>
      <button onClick={() => navigate("/poojas/" + pooja.id)} className={styles.primaryBtn + 'mt-[20px]'}>View</button>
    </div>
  )
}

export default PoojaCard