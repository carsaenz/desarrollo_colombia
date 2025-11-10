import React, { useState, useEffect } from 'react';
import { MapInfo } from '../../types/regionData';

interface MapsViewProps {
  maps: MapInfo[];
  isEditMode: boolean;
  onUpdate: (updatedMaps: MapInfo[]) => void;
}

export const MapsView: React.FC<MapsViewProps> = ({ maps, isEditMode, onUpdate }) => {
  const [localMaps, setLocalMaps] = useState<MapInfo[]>(maps);
  const [selectedMapIndex, setSelectedMapIndex] = useState(0);

  useEffect(() => {
    setLocalMaps(maps);
  }, [maps]);

  const updateAndPropagate = (updatedMaps: MapInfo[]) => {
    setLocalMaps(updatedMaps);
    onUpdate(updatedMaps);
  };

  const handleMapChange = (index: number, field: keyof MapInfo, value: string) => {
    const updatedMaps = localMaps.map((map, idx) => {
      if (idx === index) {
        return { ...map, [field]: value };
      }
      return map;
    });
    updateAndPropagate(updatedMaps);
  };

  const handleMetadataPropertyChange = (mapIndex: number, property: 'source' | 'date', value: string) => {
    const updatedMaps = localMaps.map((map, idx) => {
      if (idx === mapIndex && map.metadata) {
        return {
          ...map,
          metadata: {
            ...map.metadata,
            [property]: value,
          },
        };
      }
      return map;
    });
    updateAndPropagate(updatedMaps);
  };

  const handleAddMap = () => {
    const newMap: MapInfo = {
      title: "Nuevo Mapa",
      image: "",
      description: "Descripción del nuevo mapa.",
      metadata: { source: "", date: "" },
    };
    const updatedMaps = [...localMaps, newMap];
    updateAndPropagate(updatedMaps);
    setSelectedMapIndex(updatedMaps.length - 1);
  };

  const handleRemoveMap = (index: number) => {
    if (localMaps.length <= 1) {
      alert("No puedes eliminar el último mapa.");
      return;
    }
    const updatedMaps = localMaps.filter((_, idx) => idx !== index);
    updateAndPropagate(updatedMaps);
    setSelectedMapIndex(0); // Select the first map after deletion
  };

  const currentMap = localMaps[selectedMapIndex];

  if (!localMaps || localMaps.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-center text-gray-500">No hay mapas disponibles para esta región.</p>
        {isEditMode && (
          <button onClick={handleAddMap} className="mt-4 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
            Añadir Mapa
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-6">Mapas de la Región</h2>
      {isEditMode && (
        <div className="mb-4 flex gap-2">
          <button onClick={handleAddMap} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
            Añadir Mapa
          </button>
          {localMaps.length > 1 && (
            <button onClick={() => handleRemoveMap(selectedMapIndex)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
              Eliminar Mapa Seleccionado
            </button>
          )}
        </div>
      )}

      {localMaps.length > 1 && (
        <div className="mb-4">
          <label htmlFor="map-select" className="block text-gray-700 text-sm font-bold mb-2">
            Seleccionar Mapa:
          </label>
          <select
            id="map-select"
            value={selectedMapIndex}
            onChange={(e) => setSelectedMapIndex(parseInt(e.target.value))}
            className="block w-full md:w-1/2 lg:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          >
            {localMaps.map((map, index) => (
              <option key={index} value={index}>
                {map.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {currentMap && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {isEditMode ? (
            <input
              type="text"
              className="text-xl font-semibold mb-2 w-full p-1 border border-gray-300 rounded-md"
              value={currentMap.title}
              onChange={(e) => handleMapChange(selectedMapIndex, 'title', e.target.value)}
            />
          ) : (
            <h3 className="text-xl font-semibold mb-2">{currentMap.title}</h3>
          )}
          
          {isEditMode ? (
            <input
              type="text"
              className="w-full p-1 border border-gray-300 rounded-md mb-4"
              value={currentMap.image}
              onChange={(e) => handleMapChange(selectedMapIndex, 'image', e.target.value)}
              placeholder="URL de la Imagen del Mapa"
            />
          ) : (
            currentMap.image && (
              <img src={currentMap.image} alt={currentMap.title} className="w-full h-auto object-contain mb-4 rounded-md" />
            )
          )}
          
          {isEditMode ? (
            <textarea
              className="w-full p-1 border border-gray-300 rounded-md"
              value={currentMap.description}
              onChange={(e) => handleMapChange(selectedMapIndex, 'description', e.target.value)}
              rows={3}
            />
          ) : (
            <p className="text-gray-700 whitespace-pre-line">{currentMap.description}</p>
          )}

          {currentMap.metadata && (
            <div className="text-sm text-gray-500 mt-2">
              {isEditMode ? (
                <>
                  <input
                    type="text"
                    className="w-full p-1 border border-gray-300 rounded-md text-sm mb-1"
                    value={currentMap.metadata.source}
                    onChange={(e) => handleMetadataPropertyChange(selectedMapIndex, 'source', e.target.value)}
                    placeholder="Fuente"
                  />
                  <input
                    type="text"
                    className="w-full p-1 border border-gray-300 rounded-md text-sm"
                    value={currentMap.metadata.date}
                    onChange={(e) => handleMetadataPropertyChange(selectedMapIndex, 'date', e.target.value)}
                    placeholder="Fecha"
                  />
                </>
              ) : (
                <>
                  {currentMap.metadata.source && <p>Fuente: {currentMap.metadata.source}</p>}
                  {currentMap.metadata.date && <p>Fecha: {currentMap.metadata.date}</p>}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
