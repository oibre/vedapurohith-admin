import React, { useState, useEffect } from 'react';
import { getAllPoojas } from '../contexts/FirebaseContext';
import styles from '../global/styles';
import {Link, useNavigate} from 'react-router-dom'
import Toolbar from '../components/nav/toolbar';
import PoojaDetails from './PoojaDetails';
import PoojaCard from '../components/poojaCard';
import LoadingCards from '../components/loadingCards';

export default function Poojas() {
  const [searchValue, setSearchValue] = useState('');
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getAllPoojas().then((poojasList: any) => {
      setPoojas(poojasList);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    });
  }, []);

  const handleSearch = (searchTerm: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    setSearchValue(searchTerm);
  };

  const filteredPoojas = poojas.filter((pooja:any) => {
    return pooja.name.toLowerCase().includes(searchValue.toLowerCase());
  });

  return (
    <div className="container mx-auto mt-10 p-5">
      <Toolbar showbookBtn={false} headerOverride={false} headerName={'All Poojas'} showSearch={true} loading={loading} searchValue={searchValue} onSearch={handleSearch} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {!loading && filteredPoojas?.map((pooja) => (
          <PoojaCard pooja={pooja} />
        ))}
        {(!loading && filteredPoojas.length == 0) && ( 
        <p className='text-md text-left mt-[50px] w-full font-playfair'>
          No Poojas Found with the given search parameters  
        </p>
        )}
      </div>
      {loading && (
        <LoadingCards />
      )}
    </div>
  );
}
