import React, { useState, useEffect } from 'react';
import { RepresentativeCompany, CompanyDescription } from '../../types/regionData';
import { useEditMode } from '../../context/EditModeContext';

interface CompaniesCardProps {
  companies: RepresentativeCompany[];
  initialActiveCompanyIndex: number;
  onUpdate: (updatedCompanies: RepresentativeCompany[], updatedActiveIndex: number) => void;
}

export const CompaniesCard: React.FC<CompaniesCardProps> = ({ companies, initialActiveCompanyIndex, onUpdate }) => {
  const { isEditMode } = useEditMode();
  const [activeCompanyIndex, setActiveCompanyIndex] = useState(initialActiveCompanyIndex);
  const [localCompanies, setLocalCompanies] = useState<RepresentativeCompany[]>(companies);

  useEffect(() => {
    setLocalCompanies(companies);
  }, [companies]);

  useEffect(() => {
    setActiveCompanyIndex(initialActiveCompanyIndex);
  }, [initialActiveCompanyIndex]);

  const currentCompany = localCompanies[activeCompanyIndex];

  const updateAndPropagate = (updatedCompanies: RepresentativeCompany[], newActiveIndex: number) => {
    setLocalCompanies(updatedCompanies);
    onUpdate(updatedCompanies, newActiveIndex);
  };

  const handleCompanyChange = (field: keyof RepresentativeCompany, value: string | CompanyDescription[], companyIndex: number) => {
    const updatedCompanies = localCompanies.map((company, idx) => {
      if (idx === companyIndex) {
        return { ...company, [field]: value };
      }
      return company;
    });
    updateAndPropagate(updatedCompanies, activeCompanyIndex);
  };

  const handleDescriptionChange = (companyIndex: number, descIndex: number, field: keyof CompanyDescription, value: string) => {
    const updatedCompanies = localCompanies.map((company, idx) => {
      if (idx === companyIndex) {
        const updatedDescription = company.description.map((desc, dIdx) => {
          if (dIdx === descIndex) {
            return { ...desc, [field]: value };
          }
          return desc;
        });
        return { ...company, description: updatedDescription };
      }
      return company;
    });
    updateAndPropagate(updatedCompanies, activeCompanyIndex);
  };

  const handleAddCompany = () => {
    const newCompany: RepresentativeCompany = {
      name: "Nueva Empresa",
      logo: "",
      backgroundImage: "",
      description: [{ title: "Introducción", content: "Descripción de la nueva empresa." }],
    };
    const updatedCompanies = [...localCompanies, newCompany];
    updateAndPropagate(updatedCompanies, updatedCompanies.length - 1); // Select new company
  };

  const handleRemoveCompany = (companyIndex: number) => {
    if (localCompanies.length <= 1) {
      alert("No puedes eliminar la última empresa.");
      return;
    }
    const updatedCompanies = localCompanies.filter((_, idx) => idx !== companyIndex);
    const newActiveIndex = companyIndex === activeCompanyIndex ? 0 : activeCompanyIndex > companyIndex ? activeCompanyIndex - 1 : activeCompanyIndex;
    updateAndPropagate(updatedCompanies, newActiveIndex);
  };

  if (!localCompanies || localCompanies.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-full flex items-center justify-center">
        <p className="text-center text-gray-500">No hay empresas representativas disponibles.</p>
        {isEditMode && (
          <button onClick={handleAddCompany} className="ml-4 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
            Añadir Empresa
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="text-2xl font-bold mb-4">Empresas</h2>

      {localCompanies.length > 1 && (
        <div className="mb-4">
          <label htmlFor="company-select" className="block text-gray-700 text-sm font-bold mb-2">
            Seleccionar Empresa:
          </label>
          <select
            id="company-select"
            value={activeCompanyIndex}
            onChange={(e) => setActiveCompanyIndex(parseInt(e.target.value))}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          >
            {localCompanies.map((company, index) => (
              <option key={index} value={index}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {currentCompany && (
        <div className="space-y-4">
          {isEditMode ? (
            <input
              type="text"
              className="text-xl font-semibold w-full p-2 border border-gray-300 rounded-md"
              value={currentCompany.name}
              onChange={(e) => handleCompanyChange('name', e.target.value, activeCompanyIndex)}
            />
          ) : (
            <h3 className="text-xl font-semibold">{currentCompany.name}</h3>
          )}

          {isEditMode ? (
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={currentCompany.logo}
              onChange={(e) => handleCompanyChange('logo', e.target.value, activeCompanyIndex)}
              placeholder="URL del Logo"
            />
          ) : (
            currentCompany.logo && (
              <img src={currentCompany.logo} alt={`${currentCompany.name} Logo`} className="max-h-24 object-contain mb-2" />
            )
          )}

          {currentCompany.description.map((desc, index) => (
            <div key={index}>
              {isEditMode ? (
                <input
                  type="text"
                  className="font-bold text-md w-full p-2 border border-gray-300 rounded-md"
                  value={desc.title}
                  onChange={(e) => handleDescriptionChange(activeCompanyIndex, index, 'title', e.target.value)}
                  placeholder="Título de la Descripción"
                />
              ) : (
                desc.title && <h4 className="font-bold text-md">{desc.title}</h4>
              )}
              {isEditMode ? (
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={desc.content}
                  onChange={(e) => handleDescriptionChange(activeCompanyIndex, index, 'content', e.target.value)}
                  rows={3}
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-line">{desc.content}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {isEditMode && (
        <div className="mt-4 flex gap-2">
          <button onClick={handleAddCompany} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
            Añadir Empresa
          </button>
          <button onClick={() => handleRemoveCompany(activeCompanyIndex)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
            Eliminar Empresa
          </button>
        </div>
      )}
    </div>
  );
};
