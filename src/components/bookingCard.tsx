import React, { useEffect, useState } from 'react';
import { Base64 } from 'js-base64';
import { getPandints, updateSelectedPandit, getUserDataFromFirestore } from '../contexts/FirebaseContext';

const BookingCard = ({ booking }: any) => {
  const { poojaDetails, bookingData } = booking;
  const [pandits, setPandits] = useState([])
  const [selectedPanditID, setSelectedPanditID] = useState("")
  const [userName, setUserName] = useState("")

  console.log(bookingData)

  const getDateAndTime = (date: any) => {
    let el = Base64.decode(date).split(" ")
    el.shift()
    let str = el[0] + " " + el[1] + " " + el[2] + " " + el[3]
    return str
  }

  useEffect(() => {
    getPandints().then((resp: any) => {
      let panditData:any = []
      resp.forEach((pandit: any) => {
        panditData.push({
          value: pandit.uid,
          label: pandit.name
        })
      })
      setPandits(panditData)
    }).catch((err) => {})
    setSelectedPanditID(bookingData.panditId)
    setUserName(bookingData.userName)
  }, [])

  return (
    <div className="border bg-white rounded p-4 mb-4 hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-103">
      <h2 className="text-md font-semibold">{poojaDetails.name}</h2>
      <p className="text-gray-600 mb-2 mt-2 text-sm">{poojaDetails.description.length > 80 ? poojaDetails.description.substring(0, 77) + " ..." : poojaDetails.description}</p>
      {/* <img src={poojaDetails.image} className='rounded-lg mt-8' alt="" /> */}
      <p className='mt-8 text-sm'><strong>Pooja Date &nbsp; &nbsp; &nbsp;: &nbsp; &nbsp;</strong> {getDateAndTime(bookingData.bookingDateTime)}</p>
      <p className='mt-2 text-sm'><strong>Booked On &nbsp; &nbsp; &nbsp;: &nbsp; &nbsp;</strong> {bookingData.bookedOn.toDate().toLocaleDateString()}</p>
      <p className='mt-2 text-sm'><strong>Status&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;: &nbsp; &nbsp;</strong> {bookingData.status}</p>
      <p className='mt-2 text-sm'><strong>User&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;: &nbsp; &nbsp;</strong> {userName}</p>
      <p className='mt-6 mb-4 text-sm'><strong>Selected Pandit:</strong></p>
      {/* <Select value={selectedPanditID} options={pandits} /> */}
      <select name="panditSelector" className='w-full rounded-md bg-gray-100 border-none py-3 px-5 text-sm' onChange={(e) => {
        setSelectedPanditID(e.target.value)
        updateSelectedPandit(booking.id, e.target.value, e.target.selectedOptions[0].text)
      }} value={selectedPanditID} >
        <option value={"None"}>{"None"}</option>
        {
          pandits.map((pandit: any) => {
            return (
              <option value={pandit.value}>{pandit.label}</option>
            )
          })
        }
      </select>
    </div>
  );
};

export default BookingCard;