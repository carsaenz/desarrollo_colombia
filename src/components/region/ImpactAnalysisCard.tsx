import React from 'react';
import { Impact } from '../../types/regionData';
import { useEditMode } from '../../context/EditModeContext';

interface ImpactAnalysisCardProps {
  impact: Impact;
  onUpdate: (updatedImpact: Impact) => void;
}

export const ImpactAnalysisCard: React.FC<ImpactAnalysisCardProps> = ({ impact, onUpdate }) => {
  const { isEditMode } = useEditMode();

  const handleImpactChange = (field: keyof Impact, value: string) => {
    onUpdate({ ...impact, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="text-2xl font-bold mb-4">Análisis de Impacto</h2>
      <div className="space-y-4">
        <div>
          {isEditMode ? (
            <textarea
              key="edit-social"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={impact.social}
              onChange={(e) => handleImpactChange('social', e.target.value)}
              rows={4}
            />
          ) : (
            <p key="display-social" className="text-gray-700 whitespace-pre-line">{impact.social}</p>
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg">Impacto Político:</h3>
          {isEditMode ? (
            <textarea
              key="edit-political"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={impact.political}
              onChange={(e) => handleImpactChange('political', e.target.value)}
              rows={4}
            />
          ) : (
            <p key="display-political" className="text-gray-700 whitespace-pre-line">{impact.political}</p>
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg">Impacto Económico:</h3>
          {isEditMode ? (
            <textarea
              key="edit-economic"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={impact.economic}
              onChange={(e) => handleImpactChange('economic', e.target.value)}
              rows={4}
            />
          ) : (
            <p key="display-economic" className="text-gray-700 whitespace-pre-line">{impact.economic}</p>
          )}
        </div>
      </div>
    </div>
  );
};
