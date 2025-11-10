import React from 'react';
import { Sector, Impact, RepresentativeCompany, GdpData, TimelineEvent } from '../../types/regionData';
import { GraphsCard } from './GraphsCard';
import { ImpactAnalysisCard } from './ImpactAnalysisCard';
import { CompaniesCard } from './CompaniesCard';
import { PibCard } from './PibCard';
import { TimelineCard } from './TimelineCard';

interface SectorViewProps {
  sectorData: Sector;
  isEditMode: boolean;
  onUpdate: (updatedSector: Sector) => void;
}

export const SectorView: React.FC<SectorViewProps> = ({ sectorData, isEditMode, onUpdate }) => {
  const handleIntroductionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...sectorData, introduction: e.target.value });
  };

  const handleChartsUpdate = (updatedCharts: typeof sectorData.charts) => {
    onUpdate({ ...sectorData, charts: updatedCharts });
  };

  const handleImpactUpdate = (updatedImpact: Impact) => {
    onUpdate({ ...sectorData, impact: updatedImpact });
  };

  const handleCompaniesUpdate = (updatedCompanies: RepresentativeCompany[], updatedActiveIndex: number) => {
    onUpdate({ ...sectorData, representativeCompanies: updatedCompanies, activeCompanyIndex: updatedActiveIndex });
  };

  const handleGdpUpdate = (updatedGdp: GdpData) => {
    onUpdate({ ...sectorData, gdp: updatedGdp });
  };

  const handleTimelineUpdate = (updatedTimeline: TimelineEvent[]) => {
    onUpdate({ ...sectorData, timeline: updatedTimeline });
  };

  return (
    <div className="space-y-8">
      {/* Tarjeta de Descripción del Sector */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {isEditMode ? (
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            value={sectorData.introduction}
            onChange={handleIntroductionChange}
            rows={5}
          />
        ) : (
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{sectorData.introduction}</p>
        )}
      </div>

      {/* Tarjeta de Gráficas */}
      <GraphsCard 
        charts={sectorData.charts} 
        isEditMode={isEditMode} 
        onUpdate={handleChartsUpdate} 
      />

      {/* Tarjetas de Impacto y Empresas */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <ImpactAnalysisCard 
            impact={sectorData.impact} 
            isEditMode={isEditMode} 
            onUpdate={handleImpactUpdate} 
          />
        </div>
        <div className="lg:w-1/2">
          <CompaniesCard 
            companies={sectorData.representativeCompanies} 
            initialActiveCompanyIndex={sectorData.activeCompanyIndex} 
            isEditMode={isEditMode}
            onUpdate={handleCompaniesUpdate}
          />
        </div>
      </div>

      {/* Tarjeta de PIB y Aportes */}
      <PibCard 
        gdp={sectorData.gdp} 
        isEditMode={isEditMode} 
        onUpdate={handleGdpUpdate} 
      />

      {/* Tarjeta de Línea de Tiempo */}
      <TimelineCard 
        timeline={sectorData.timeline} 
        isEditMode={isEditMode} 
        onUpdate={handleTimelineUpdate} 
      />
    </div>
  );
};
