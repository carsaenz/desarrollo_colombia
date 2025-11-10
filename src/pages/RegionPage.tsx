import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRegionData } from '../hooks/useRegionData';
import { SectorView } from '../components/region/SectorView';
import { MapsView } from '../components/region/MapsView';
import { RegionData, MapInfo } from '../types/regionData';
import { EditModeProvider, useEditMode } from '../context/EditModeContext';
import { useFirestoreUpdate } from '../hooks/useFirestoreUpdate';

type ViewType = keyof RegionData | 'Mapas';

const SECTORS: (keyof RegionData)[] = ["Primario", "Secundario", "Terciario", "Cuaternario", "Quinario"];

const RegionPageContent: React.FC = () => {
  const { regionName } = useParams<{ regionName: string }>();
  const { data, loading, error } = useRegionData(regionName);
  const [currentView, setCurrentView] = useState<ViewType>('Primario');
  const { isEditMode, toggleEditMode } = useEditMode();
  const { updateRegionData, isUpdating, updateError, updateSuccess } = useFirestoreUpdate(regionName);

  // Local state to hold changes before saving
  const [localData, setLocalData] = useState<RegionData | null>(null);

  useEffect(() => {
    if (data) {
      setLocalData(data);
    }
  }, [data]);

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        toggleEditMode();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, toggleEditMode]);

  const handleSave = async () => {
    if (localData) {
      await updateRegionData(localData);
    }
  };

  const handleDiscard = () => {
    setLocalData(data); // Revert to original data
    toggleEditMode(); // Exit edit mode
  };

  const handleMapsUpdate = (updatedMaps: MapInfo[]) => {
    setLocalData(prevData => {
      if (!prevData) return null;
      const sectorKey = SECTORS[0]; // Assuming maps are tied to the first sector for now
      return {
        ...prevData,
        [sectorKey]: {
          ...prevData[sectorKey],
          maps: updatedMaps,
        },
      };
    });
  };

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-screen">Cargando datos de la región...</div>;
    }
    if (error) {
      return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    }
    if (!localData) { // Use localData for rendering
      return <div className="flex justify-center items-center h-screen">No hay datos disponibles para esta región.</div>;
    }

    if (currentView === 'Mapas') {
      const mapsData = localData[SECTORS[0]].maps; 
      return (
        <MapsView 
          maps={mapsData} 
          onUpdate={handleMapsUpdate} 
        />
      );
    }
    
    const sectorKey = currentView as keyof RegionData;
    return (
      <SectorView 
        sectorData={localData[sectorKey]} 
        onUpdate={(updatedSectorData) => {
          setLocalData(prevData => {
            if (!prevData) return null;
            return {
              ...prevData,
              [sectorKey]: updatedSectorData,
            };
          });
        }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-500 shadow-md sticky top-0 z-10">
        <nav className="container mx-auto px-4 py-2 flex flex-wrap justify-center items-center gap-4">
          {SECTORS.map(sector => (
            <button
              key={sector}
              onClick={() => setCurrentView(sector)}
              className={`px-4 py-2 font-semibold rounded-md transition-colors duration-200 ${currentView === sector ? 'bg-white text-teal-600 shadow-inner' : 'text-white hover:bg-teal-400'}`}
            >
              {sector}
            </button>
          ))}
          <button
            onClick={() => setCurrentView('Mapas')}
            className={`px-4 py-2 font-semibold rounded-md transition-colors duration-200 ${currentView === 'Mapas' ? 'bg-white text-teal-600 shadow-inner' : 'text-white hover:bg-teal-400'}`}
          >
            Mapas
          </button>
          <div className="ml-auto flex items-center gap-2">
            {isEditMode && (
              <>
                <button
                  onClick={handleSave}
                  className={`px-4 py-2 font-bold rounded-md text-white transition-colors duration-200 ${updateSuccess ? 'bg-blue-500' : 'bg-green-500 hover:bg-green-600'}`}
                  disabled={isUpdating || updateSuccess}
                >
                  {isUpdating ? 'Guardando...' : updateSuccess ? '¡Guardado!' : 'Guardar'}
                </button>
                <button
                  onClick={handleDiscard}
                  className="px-4 py-2 font-bold rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
                  disabled={isUpdating}
                >
                  Descartar
                </button>
              </>
            )}
            <button
              onClick={toggleEditMode}
              className={`px-4 py-2 font-bold rounded-md transition-colors duration-200 ${isEditMode ? 'bg-yellow-400 text-black' : 'bg-gray-600 text-white hover:bg-gray-500'}`}
            >
              {isEditMode ? 'Salir de Edición' : 'Modo Edición'}
            </button>
          </div>
        </nav>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        <Link to="/" className="text-teal-600 hover:underline mb-4 inline-block">&larr; Volver a Regiones</Link>
        {updateError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{updateError}</div>}
        {updateSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">¡Cambios guardados exitosamente!</div>}
        {renderContent()}
      </main>
    </div>
  );
};

const RegionPage: React.FC = () => (
  <EditModeProvider>
    <RegionPageContent />
  </EditModeProvider>
);

export default RegionPage;
