// PoojaDetails.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase'; 
import Toolbar from '../components/nav/toolbar';
import bg from '../assets/bg.png'
import { getLatestPoojas, addEntryToBookings, useAuth } from '../contexts/FirebaseContext';
import PoojaCard from '../components/poojaCard';
import styles from '../global/styles';
import { useToast, EToastTypes } from '../contexts/ToastContext'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoadingCards from '../components/loadingCards';


const PoojaDetails = () => {
  const { id } = useParams();
  const { login, currentUser } = useAuth()
  const { showTypedToast } = useToast()
  const [pooja, setPooja] = useState(null);
  const [itemDetails, setItemDetails] = useState([]);
  const [loading, setLoading] = useState(true)
  const [apiLoading, setAPILoading] = useState(false)

  const [latestPoojas, setLatestPoojas] = useState([])
  const [showLatestPoojas, setShowLatestPoojas] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null);

  const navigate = useNavigate()

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 3);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    // Fetch pooja details based on ID from Firebase
    const fetchPoojaDetails = async () => {
      try {
        const poojaDoc = await db.collection('poojas').doc(id).get();
        if (poojaDoc.exists) {
          const poojaData = poojaDoc.data();
          setPooja({ id: poojaDoc.id, ...poojaData });

          // Fetch item details using item IDs from the poojaData
          const itemPromises = poojaData.items.map(async (item) => {
            const itemDoc = await db.collection('items').doc(item.itemId).get();
            if (itemDoc.exists) {
              return { id: itemDoc.id, ...itemDoc.data() };
            }
            return null;
          });

          // Wait for all item promises to resolve and update the state
          const itemsData = await Promise.all(itemPromises);
          console.log(itemsData)
          itemsData.forEach((item, index) => {
            itemsData[index].quantity = poojaData.items[index].quantity
          })
          setItemDetails(itemsData);
          setLoading(false)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching pooja details:', error);
        setLoading(false)
      }
    };

    fetchPoojaDetails();
  }, [id]);

  useEffect(() => {
    getLatestPoojas(2).then((poojasList) => {
      setLatestPoojas([...poojasList]);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    });
  }, [])

  const emptyFunc = (e:any) => {}

  if (pooja) {
      return (
        <div className='container mx-auto mt-10 p-5 flex flex-col items-center'>
          {/* <Toolbar showbookBtn={true} headerOverride={true} headerName={pooja.name} showSearch={false} bookingDateAndTime={selectedDate} loading={loading} searchValue={''} poojaId={id}  onSearch={emptyFunc} /> */}
          <div className='flex flex-col md:flex-row gap-[50px] mt-[30px] wrap w-full items-start md:items-center justify-start'>
            <div className='w-1/1 md:w-1/3'>
              {/* Image */}
              <img src={bg} alt={pooja.name} className='rounded-lg shadow-lg mb-[50px] w-full h-auto md:h-[300px] object-cover'/>
            </div>
            <div className='w-1/1 md:w-2/3'>
              {/* Pooja Details */}
              <h1 className='text-3xl font-semibold mb-4 font-playfair'>{pooja.name}</h1>
              <p className='text-xl font-semibold mb-[30px] font-playfair'>Duration: {pooja.duration}</p>
    
              {/* Description and other details */}
              <h2 className='text-xl font-semibold mb-[15px] font-playfair'>Description:</h2>
              <p className='text-gray-700 mb-4'>{pooja.description}</p>
            </div>
          </div>
          <h2 className='text-xl font-playfair font-semibold mb-2 mt-[50px] md:mt-[0px] mr-auto'>Items:</h2>
          <table className='rounded-lg mt-[30px] mb-[50px] text-left bg-white hover:shadow-lg w-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-103'>
            <thead className='rounded-lg'>
              <tr className='rounded-lg p-5'>
                <th className='text-left p-5'>Item Name</th>
                <th className='text-left p-5'>Quantity</th>
                <th className='text-left p-5'>Type</th>
              </tr>
            </thead>
            <tbody>
              {itemDetails.map((item: any) => (
                <tr key={item.id} className='rounded-lg p-5'>
                  <td className='p-5'>{item.name}</td>
                  <td className='p-5'>{item.quantity}</td>
                  <td className='p-5'>{item.quantityType}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Similar Poojas */}
    
          {showLatestPoojas && <div className='w-full mt-[50px]'>
            <h2 className='font-playfair text-lg font-bold mb-[30px]'>Similar Poojas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 gap-6">
              {!loading && latestPoojas?.map((pooja) => (
                <PoojaCard pooja={pooja} />
              ))}
              {(!loading && latestPoojas.length == 0) && ( 
              <p className='text-md text-left mt-[50px] w-full font-playfair'>
                No Poojas Found with the given search parameters  
              </p>
              )}
            </div>
            {loading && (
              <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
                <div className="border bg-white shadow rounded-md p-4">
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                    <div className="flex-1 space-y-6 py-1">
                      <div className="h-2 bg-gray-300 rounded"></div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-2 bg-gray-300 rounded col-span-2"></div>
                          <div className="h-2 bg-gray-300 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border bg-white shadow rounded-md p-4">
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                    <div className="flex-1 space-y-6 py-1">
                      <div className="h-2 bg-gray-300 rounded"></div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-2 bg-gray-300 rounded col-span-2"></div>
                          <div className="h-2 bg-gray-300 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border bg-white shadow rounded-md p-4">
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                    <div className="flex-1 space-y-6 py-1">
                      <div className="h-2 bg-gray-300 rounded"></div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-2 bg-gray-300 rounded col-span-2"></div>
                          <div className="h-2 bg-gray-300 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>}
    
        </div>
      );
  }

  return (
    <LoadingCards />
  );

};

export default PoojaDetails;
