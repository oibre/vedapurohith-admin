import React, { useState } from 'react';
import styles from '../../global/styles';
import { useAuth } from '../../contexts/FirebaseContext'

const Toolbar = ({ headerName, loading, searchValue, onSearch, showSearch, headerOverride, showbookBtn, bookingDateAndTime="", poojaId=""}: any) => {
  
  const [searchTerm, setSearchTerm] = useState(searchValue);
  const { login, currentUser } = useAuth()

  const addToCart = () => {
    console.log(poojaId, bookingDateAndTime)
  }

  return (
    <div className="mb-6 bg-white border w-[100vw] sm:w-[105%] ml-[-20px] sm:ml-[-2.5%] shadow-lg sm:rounded-lg p-[15px] sticky top-[12vh] mt-[-3vh] lg:top-[0vh] z-10 flex flex-row sm:flex-row items-center justify-center">
      {headerName && <h1 className={"text-lg sm:block lg:w-1/3 mr-auto lg:text-xl font-playfair font-semibold mb-2 sm:mb-0 py-4 " + (headerOverride ? "w-2/3" : "w-1/1 hidden")}>{headerName}</h1>}
      {showSearch && <div className={'sm:w-2/3 lg:w-2/3 flex flex-row ' + (headerOverride ? "w-1/3" : "w-full")}>
        <input
          type="text"
          placeholder="Search For Something..."
          className="py-4 px-5 w-full rounded-lg bg-gray-100 border-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={styles.primaryBtn + ' ml-[10px] md:ml-[10px] px-7 md:px-12' + (loading ? " bg-gray-700 cursor-not-allowed" : "")} onClick={() => onSearch(searchTerm)}>
          {loading ? 'Search' : 'Search'}
        </button>
      </div>}
      {showbookBtn && <button className={styles.primaryBtn + ' ml-[auto] md:ml-[10px] px-7 md:px-12 mt-[0px]' + (loading ? " bg-gray-700 cursor-not-allowed" : "")} onClick={() => addToCart()}>
        {loading ? 'Book' : 'Book'}
      </button>}
    </div>
  );
};

export default Toolbar;
