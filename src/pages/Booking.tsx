import { useEffect, useState } from "react"
import { useAuth, getAllBookings } from "../contexts/FirebaseContext"
import LoadingCards from "../components/loadingCards"
import Toolbar from "../components/nav/toolbar"
import BookingCard from "../components/bookingCard"

const Booking = () => {

  const [pageLoading, setPageLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth()
  const [bookings, setBookings] = useState([])

  const handleSearch = (searchTerm: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    setSearchValue(searchTerm);
  };

  const filteredBooking = bookings.filter((booking:any) => {
    return booking.poojaDetails.name.toLowerCase().includes(searchValue.toLowerCase());
  });

  useEffect(() => {
    getAllBookings().then((resp: any) => {
      setTimeout(() => {
        setPageLoading(false)
      }, 1500);
      console.log(resp)
      setBookings(resp)
    }).catch((err: any) => {
      console.log(err)
      setTimeout(() => {
        setPageLoading(false)
      }, 1500);
    })
    console.log(bookings)
  }, [])

  return (
    <div className="container mx-auto mt-10 p-5">
      {/* <Toolbar showbookBtn={false} headerOverride={false} headerName={'Bookings'} showSearch={true} loading={loading} searchValue={searchValue} onSearch={handleSearch} /> */}
      <p className="hidden lg:block my-[20px] text-xl font-bold font-playfair">All Bookings</p>
      {pageLoading && <LoadingCards />}
      {!pageLoading && filteredBooking.length === 0 && <p>No bookings found.</p>}
      {!pageLoading && filteredBooking.length > 0 && (
        <>
          <div className="mt-[0px] flex flex-row flex-wrap gap-[10px]">
            {bookings.map((booking: any) => (
              <div className="w-[45%]">
                <BookingCard key={booking.id} booking={booking} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Booking