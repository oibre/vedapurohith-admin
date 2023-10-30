import React from 'react';

const BookingCard = ({ booking }) => {
  const { poojaDetails, bookingData } = booking;

  return (
    <div className="border bg-white rounded p-4 mb-4 hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-103">
      <h2 className="text-xl font-semibold">{poojaDetails.name}</h2>
      <p className="text-gray-600 mb-2 mt-2">{poojaDetails.description}</p>
      <p className='mt-5'><strong>Pooja Date:</strong> {bookingData.bookingDateTime.toDate().toLocaleDateString()}</p>
      <p className='mt-5'><strong>Booked On:</strong> {bookingData.bookedOn.toDate().toLocaleDateString()}</p>
      <p><strong>Completion Status:</strong> {bookingData.completed ? 'Completed' : 'Pending'}</p>
    </div>
  );
};

export default BookingCard;