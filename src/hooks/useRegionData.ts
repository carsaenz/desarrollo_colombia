import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './useAuth';
import { RegionData } from '../types/regionData';
import initialData from '../../../data.json'; // Importando los datos iniciales

export const useRegionData = (regionName: string | undefined) => {
  const { user } = useAuth();
  const [data, setData] = useState<RegionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !regionName) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'users', user.uid, 'regions', regionName);

    const unsubscribe = onSnapshot(docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setData(docSnap.data() as RegionData);
          setLoading(false);
        } else {
          // El documento no existe, así que lo creamos con los datos iniciales
          console.log(`No data for region ${regionName}. Seeding initial data...`);
          const typedInitialData: RegionData = initialData as RegionData;
          setDoc(docRef, typedInitialData)
            .then(() => {
              console.log("Initial data seeded successfully.");
              setData(typedInitialData);
              setLoading(false);
            })
            .catch(e => {
              console.error("Error seeding data: ", e);
              setError("Failed to initialize region data.");
              setLoading(false);
            });
        }
      },
      (e) => {
        console.error("Error with real-time listener: ", e);
        setError("Failed to listen for real-time updates.");
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user, regionName]);

  return { data, loading, error };
};
