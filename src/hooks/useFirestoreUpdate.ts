import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { RegionData } from '../types/regionData';

export const useFirestoreUpdate = (regionName: string | undefined) => {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const updateRegionData = async (newData: Partial<RegionData>) => {
    if (!user || !regionName) {
      setUpdateError("User not authenticated or region name not provided.");
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const docRef = doc(db, 'users', user.uid, 'regions', regionName);
      await updateDoc(docRef, newData);
      setUpdateSuccess(true);
      console.log("Document successfully updated!");
    } catch (e) {
      console.error("Error updating document: ", e);
      setUpdateError("Failed to update data in Firestore.");
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateRegionData, isUpdating, updateError, updateSuccess };
};
