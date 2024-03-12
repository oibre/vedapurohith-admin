import { db } from '../firebase'; // Import your Firestore instance
import { useState, useEffect } from 'react';
import styles from '../global/styles';
import { getLatestPoojas } from '../contexts/FirebaseContext';
import PoojaCard from '../components/poojaCard';
import Toolbar from '../components/nav/toolbar';
import LoadingCards from '../components/loadingCards';

export default function Dashboard() {
  const [searchValue, setSearchValue] = useState('');
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestPoojas(3).then((poojasList: any) => {
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
      {/* <h1 className="text-lg lg:text-xl font-playfair font-semibold mb-6">Top Poojas</h1> */}
      {/* <Toolbar showbookBtn={false} headerOverride={false} headerName={'Dashboard'} showSearch={true} loading={loading} searchValue={searchValue} onSearch={handleSearch} /> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {!loading && poojas?.map((pooja) => (
          <PoojaCard pooja={pooja} />
        ))}
      </div>
      {loading && (
        <LoadingCards />
      )}
    </div>
  );
}
