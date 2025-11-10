import React from 'react';
import { Impact } from '../../types/regionData';

interface ImpactAnalysisCardProps {
  impact: Impact;
  isEditMode: boolean;
  onUpdate: (updatedImpact: Impact) => void;
}

export const ImpactAnalysisCard: React.FC<ImpactAnalysisCardProps> = ({ impact }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="text-2xl font-bold mb-4">Análisis de Impacto</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-lg">Impacto Social:</h3>
          <p className="text-gray-700 whitespace-pre-line">{impact.social}</p>
        </div>
        <div>
          <h3 className="font-bold text-lg">Impacto Político:</h3>
          <p className="text-gray-700 whitespace-pre-line">{impact.political}</p>
        </div>
        <div>
          <h3 className="font-bold text-lg">Impacto Económico:</h3>
          <p className="text-gray-700 whitespace-pre-line">{impact.economic}</p>
        </div>
      </div>
    </div>
  );
};
