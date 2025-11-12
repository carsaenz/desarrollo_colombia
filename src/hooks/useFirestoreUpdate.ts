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

    console.log("Attempting to update Firestore...");
    console.log("User ID:", user.uid);
    console.log("Region Name:", regionName);
    console.log("Data to save:", newData);

    try {
      const docRef = doc(db, 'regions', regionName);
      console.log("Document reference created. Calling updateDoc...");
      await updateDoc(docRef, newData);
      setUpdateSuccess(true);
      console.log("Document successfully updated!");
    } catch (e) {
      console.error("!!! Firestore update failed. Error:", e);
      setUpdateError("Failed to update data in Firestore. See console for details.");
    } finally {
      console.log("Update function finished. Resetting isUpdating state.");
      setIsUpdating(false);
    }
  };

  return { updateRegionData, isUpdating, updateError, updateSuccess };
};
