import React, { useState, useEffect } from 'react';
import { getAllPoojas } from '../contexts/FirebaseContext';
import styles from '../global/styles';
import {Link, useNavigate} from 'react-router-dom'
import Toolbar from '../components/nav/toolbar';
import PoojaDetails from './PoojaDetails';
import PoojaCard from '../components/poojaCard';

export default function Poojas() {
  const [searchValue, setSearchValue] = useState('');
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getAllPoojas().then((poojasList) => {
      setPoojas([...poojasList]);
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
    </div>
  );
}
