import React, { useState, useEffect } from 'react';
import { TimelineEvent } from '../../types/regionData';

interface TimelineCardProps {
  timeline: TimelineEvent[];
  isEditMode: boolean;
  onUpdate: (updatedTimeline: TimelineEvent[]) => void;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ timeline, isEditMode, onUpdate }) => {
  const [expandedEventIndex, setExpandedEventIndex] = useState<number | null>(null);
  const [localTimeline, setLocalTimeline] = useState<TimelineEvent[]>(timeline);

  useEffect(() => {
    setLocalTimeline(timeline);
  }, [timeline]);

  const updateAndPropagate = (updatedTimeline: TimelineEvent[]) => {
    setLocalTimeline(updatedTimeline);
    onUpdate(updatedTimeline);
  };

  const handleEventChange = (index: number, field: keyof TimelineEvent, value: string) => {
    const updatedTimeline = localTimeline.map((event, idx) => {
      if (idx === index) {
        return { ...event, [field]: value };
      }
      return event;
    });
    updateAndPropagate(updatedTimeline);
  };

  const handleAddEvent = () => {
    const newEvent: TimelineEvent = {
      year: (new Date().getFullYear()).toString(),
      event: "Nuevo Evento",
      detailedEvent: "Descripción detallada del nuevo evento.",
      image: "",
    };
    const updatedTimeline = [...localTimeline, newEvent];
    updateAndPropagate(updatedTimeline);
  };

  const handleRemoveEvent = (index: number) => {
    if (localTimeline.length <= 1) {
      alert("No puedes eliminar el último evento.");
      return;
    }
    const updatedTimeline = localTimeline.filter((_, idx) => idx !== index);
    updateAndPropagate(updatedTimeline);
    if (expandedEventIndex === index) {
      setExpandedEventIndex(null);
    } else if (expandedEventIndex !== null && expandedEventIndex > index) {
      setExpandedEventIndex(expandedEventIndex - 1);
    }
  };

  if (!localTimeline || localTimeline.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-center text-gray-500">No hay eventos en la línea de tiempo disponibles.</p>
        {isEditMode && (
          <button onClick={handleAddEvent} className="mt-4 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
            Añadir Evento
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Línea de Tiempo: Eventos Clave</h2>
      {isEditMode && (
        <div className="mb-4 flex gap-2">
          <button onClick={handleAddEvent} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
            Añadir Evento
          </button>
        </div>
      )}
      <div className="relative">
        {/* Línea vertical */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 hidden sm:block"></div>
        
        <div className="space-y-6">
          {localTimeline.map((event, index) => (
            <div key={index} className="flex items-start relative">
              {/* Círculo en la línea */}
              <div className="w-4 h-4 bg-teal-500 rounded-full absolute left-3 -top-0.5 z-10 hidden sm:block"></div>
              
              <div className="sm:ml-10 flex-grow">
                <div 
                  className="bg-gray-100 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => setExpandedEventIndex(expandedEventIndex === index ? null : index)}
                >
                  {isEditMode ? (
                    <input
                      type="text"
                      className="font-bold text-lg text-teal-700 w-full p-1 border border-gray-300 rounded-md mb-1"
                      value={event.year}
                      onChange={(e) => handleEventChange(index, 'year', e.target.value)}
                    />
                  ) : (
                    <h3 className="font-bold text-lg text-teal-700">{event.year}</h3>
                  )}
                  
                  {isEditMode ? (
                    <input
                      type="text"
                      className="text-gray-800 w-full p-1 border border-gray-300 rounded-md"
                      value={event.event}
                      onChange={(e) => handleEventChange(index, 'event', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-800">{event.event}</p>
                  )}

                  {expandedEventIndex === index && (
                    <div className="mt-2 pt-2 border-t border-gray-300 text-gray-600">
                      {isEditMode ? (
                        <textarea
                          className="w-full p-1 border border-gray-300 rounded-md"
                          value={event.detailedEvent}
                          onChange={(e) => handleEventChange(index, 'detailedEvent', e.target.value)}
                          rows={3}
                        />
                      ) : (
                        <p className="whitespace-pre-line">{event.detailedEvent}</p>
                      )}
                    </div>
                  )}
                </div>
                {isEditMode && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRemoveEvent(index); }}
                    className="mt-2 px-2 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                  >
                    Eliminar Evento
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
