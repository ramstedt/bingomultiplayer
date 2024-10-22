'use client'
import styles from './page.module.css';
import BingoCard from './components/BingoCard/BingoCard';
import { useState, useEffect } from 'react';
import { db } from '@/firebase.config';
import { ref, child, get } from 'firebase/database';


export default function Home() {
/*   const [data, setData] = useState(null);

  useEffect(() => {
    const dbRef = ref(db);
    const listener = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      setData(data);
    });
  
    return () => listener(); 
  }, []); */

  const [playerData, setPlayerData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('playerId1');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(child(ref(db), `players/${searchQuery}`));
        if (snapshot.exists()) {
          setPlayerData(snapshot.val());
        } else {
          setPlayerData(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {playerData ? (
        <div>
          <p>Name: {playerData.name}</p>
        </div>
      ) : (
        <p>No player found.</p>
      )}
    </div>
  );
};




{/*       {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          {value.playerId1 && value.playerId1.name}

        </div>
      ))} */}


