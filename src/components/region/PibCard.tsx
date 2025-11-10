import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GdpData, GdpDepartment } from '../../types/regionData';

interface PibCardProps {
  gdp: GdpData;
  isEditMode: boolean;
  onUpdate: (updatedGdp: GdpData) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6666', '#66CCFF', '#FFCC66', '#99FF99', '#FF99CC'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border border-gray-300 rounded-md shadow-md text-sm">
        <p className="font-bold">{label}</p>
        {payload.map((p: any, index: number) => (
          <p key={index} style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const PibCard: React.FC<PibCardProps> = ({ gdp, isEditMode, onUpdate }) => {
  const [view, setView] = useState<'nacional' | 'regional'>('nacional');
  const [selectedDepartmentIndex, setSelectedDepartmentIndex] = useState(0);
  const [localGdp, setLocalGdp] = useState<GdpData>(gdp);

  useEffect(() => {
    setLocalGdp(gdp);
  }, [gdp]);

  const updateAndPropagate = (updatedGdp: GdpData) => {
    setLocalGdp(updatedGdp);
    onUpdate(updatedGdp);
  };

  const handleNationalValueChange = (index: number, value: string) => {
    const newValues = [...localGdp.nacional.values];
    newValues[index] = parseFloat(value);
    updateAndPropagate({ ...localGdp, nacional: { ...localGdp.nacional, values: newValues } });
  };

  const handleNationalPercentageChange = (index: number, value: string) => {
    const newPercentages = [...localGdp.nacional.percentages];
    newPercentages[index] = parseFloat(value);
    updateAndPropagate({ ...localGdp, nacional: { ...localGdp.nacional, percentages: newPercentages } });
  };

  const handleAddNationalRegion = () => {
    const newValues = [...localGdp.nacional.values, 0];
    const newPercentages = [...localGdp.nacional.percentages, 0];
    updateAndPropagate({ ...localGdp, nacional: { values: newValues, percentages: newPercentages } });
  };

  const handleRemoveNationalRegion = (index: number) => {
    if (localGdp.nacional.values.length <= 1) {
      alert("No puedes eliminar la última región nacional.");
      return;
    }
    const newValues = localGdp.nacional.values.filter((_, i) => i !== index);
    const newPercentages = localGdp.nacional.percentages.filter((_, i) => i !== index);
    updateAndPropagate({ ...localGdp, nacional: { values: newValues, percentages: newPercentages } });
  };

  const handleDepartmentNameChange = (value: string) => {
    const updatedDepartments = localGdp.regional.departments.map((dept, idx) => {
      if (idx === selectedDepartmentIndex) {
        return { ...dept, name: value };
      }
      return dept;
    });
    updateAndPropagate({ ...localGdp, regional: { ...localGdp.regional, departments: updatedDepartments } });
  };

  const handleDepartmentActivityChange = (year: string, value: string) => {
    const updatedDepartments = localGdp.regional.departments.map((dept, idx) => {
      if (idx === selectedDepartmentIndex) {
        return { ...dept, activities: { ...dept.activities, [year]: parseFloat(value) } };
      }
      return dept;
    });
    updateAndPropagate({ ...localGdp, regional: { ...localGdp.regional, departments: updatedDepartments } });
  };

  const handleDepartmentPercentageChange = (activity: string, value: string) => {
    const updatedDepartments = localGdp.regional.departments.map((dept, idx) => {
      if (idx === selectedDepartmentIndex) {
        return { ...dept, percentages: { ...dept.percentages, [activity]: parseFloat(value) } };
      }
      return dept;
    });
    updateAndPropagate({ ...localGdp, regional: { ...localGdp.regional, departments: updatedDepartments } });
  };

  const handleAddDepartmentActivity = () => {
    const newActivityName = prompt("Nombre de la nueva actividad:");
    if (!newActivityName) return;

    const updatedDepartments = localGdp.regional.departments.map((dept, idx) => {
      if (idx === selectedDepartmentIndex) {
        return {
          ...dept,
          percentages: { ...dept.percentages, [newActivityName]: 0 },
        };
      }
      return dept;
    });
    updateAndPropagate({ ...localGdp, regional: { ...localGdp.regional, departments: updatedDepartments } });
  };

  const handleRemoveDepartmentActivity = (activity: string) => {
    const updatedDepartments = localGdp.regional.departments.map((dept, idx) => {
      if (idx === selectedDepartmentIndex) {
        const newPercentages = { ...dept.percentages };
        delete newPercentages[activity];
        return { ...dept, percentages: newPercentages };
      }
      return dept;
    });
    updateAndPropagate({ ...localGdp, regional: { ...localGdp.regional, departments: updatedDepartments } });
  };

  const handleAddDepartment = () => {
    const newDepartment: GdpDepartment = {
      name: "Nuevo Departamento",
      activities: { "2015": 0, "2016": 0, "2017": 0, "2018": 0, "2019": 0, "2020": 0, "2021": 0, "2022": 0, "2023": 0, "2024": 0 },
      percentages: { "Agricultura": 0, "Industria": 0, "Servicios": 0, "Mineria": 0 },
    };
    const updatedDepartments = [...localGdp.regional.departments, newDepartment];
    updateAndPropagate({ ...localGdp, regional: { ...localGdp.regional, departments: updatedDepartments } });
    setSelectedDepartmentIndex(updatedDepartments.length - 1);
  };

  const handleRemoveDepartment = (index: number) => {
    if (localGdp.regional.departments.length <= 1) {
      alert("No puedes eliminar el último departamento.");
      return;
    }
    const updatedDepartments = localGdp.regional.departments.filter((_, idx) => idx !== index);
    updateAndPropagate({ ...localGdp, regional: { ...localGdp.regional, departments: updatedDepartments } });
    setSelectedDepartmentIndex(0);
  };

  const nationalData = localGdp.nacional.values.map((value, index) => ({
    name: `Región ${index + 1}`, // Assuming regions are ordered
    value: value,
    percentage: localGdp.nacional.percentages[index],
  }));

  const regionalDepartments = localGdp.regional.departments;
  const currentDepartment = regionalDepartments[selectedDepartmentIndex];

  const departmentActivitiesData = currentDepartment ? Object.keys(currentDepartment.activities).map(year => ({
    name: year,
    value: currentDepartment.activities[year],
  })) : [];

  const departmentPercentagesData = currentDepartment ? Object.keys(currentDepartment.percentages).filter(key => !['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'].includes(key)).map(activity => ({
    name: activity,
    value: currentDepartment.percentages[activity],
  })) : [];


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">PIB y Aportes "En miles de millones"</h2>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setView('nacional')}
          className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${view === 'nacional' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          PIB Nacional
        </button>
        <button
          onClick={() => setView('regional')}
          className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${view === 'regional' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          PIB Regional
        </button>
      </div>

      {view === 'nacional' && (
        <div className="space-y-8">
          <h3 className="text-xl font-semibold">PIB Nacional por Región</h3>
          {isEditMode && (
            <div className="mb-4 p-3 border border-gray-200 rounded-md">
              <h4 className="font-bold text-md mb-2">Editar Regiones Nacionales:</h4>
              {localGdp.nacional.values.map((value, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <span className="w-20">Región {index + 1}:</span>
                  <input
                    type="number"
                    className="w-24 p-1 border border-gray-300 rounded-md text-sm"
                    value={value}
                    onChange={(e) => handleNationalValueChange(index, e.target.value)}
                  />
                  <input
                    type="number"
                    className="w-24 p-1 border border-gray-300 rounded-md text-sm"
                    value={localGdp.nacional.percentages[index]}
                    onChange={(e) => handleNationalPercentageChange(index, e.target.value)}
                  />
                  <button onClick={() => handleRemoveNationalRegion(index)} className="px-2 py-1 bg-red-400 text-white rounded-md text-sm hover:bg-red-500">
                    Eliminar
                  </button>
                </div>
              ))}
              <button onClick={handleAddNationalRegion} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 mt-2">
                Añadir Región
              </button>
            </div>
          )}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nationalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="value" name="Valor (miles de millones)" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="lg:w-1/2 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={nationalData}
                    dataKey="percentage"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#82ca9d"
                    label
                  >
                    {nationalData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {view === 'regional' && (
        <div className="space-y-8">
          <h3 className="text-xl font-semibold mb-4">PIB Regional por Departamento</h3>
          <div className="mb-4">
            <label htmlFor="department-select" className="block text-gray-700 text-sm font-bold mb-2">
              Seleccionar Departamento:
            </label>
            <select
              id="department-select"
              value={selectedDepartmentIndex}
              onChange={(e) => setSelectedDepartmentIndex(parseInt(e.target.value))}
              className="block w-full md:w-1/2 lg:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            >
              {regionalDepartments.map((dept, index) => (
                <option key={index} value={index}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {currentDepartment && (
            <div className="space-y-8">
              {isEditMode ? (
                <input
                  type="text"
                  className="text-lg font-bold w-full p-2 border border-gray-300 rounded-md"
                  value={currentDepartment.name}
                  onChange={(e) => handleDepartmentNameChange(e.target.value)}
                />
              ) : (
                <h4 className="text-lg font-bold">{currentDepartment.name} - Actividades Económicas</h4>
              )}
              
              {isEditMode && (
                <div className="mb-4 p-3 border border-gray-200 rounded-md">
                  <h5 className="font-bold text-md mb-2">Editar Actividades por Año:</h5>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Object.keys(currentDepartment.activities).map((year) => (
                      <div key={year} className="flex items-center gap-1">
                        <span className="text-sm">{year}:</span>
                        <input
                          type="number"
                          className="w-20 p-1 border border-gray-300 rounded-md text-sm"
                          value={currentDepartment.activities[year]}
                          onChange={(e) => handleDepartmentActivityChange(year, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  <h5 className="font-bold text-md mb-2 mt-4">Editar Porcentajes por Actividad:</h5>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(currentDepartment.percentages).filter(key => !['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'].includes(key)).map((activity) => (
                      <div key={activity} className="flex items-center gap-1">
                        <span className="text-sm">{activity}:</span>
                        <input
                          type="number"
                          className="w-20 p-1 border border-gray-300 rounded-md text-sm"
                          value={currentDepartment.percentages[activity]}
                          onChange={(e) => handleDepartmentPercentageChange(activity, e.target.value)}
                        />
                        <button onClick={() => handleRemoveDepartmentActivity(activity)} className="px-2 py-1 bg-red-400 text-white rounded-md text-sm hover:bg-red-500">
                          Eliminar
                        </button>
                      </div>
                    ))}
                    <button onClick={handleAddDepartmentActivity} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 mt-2">
                      Añadir Actividad
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentActivitiesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="value" name="Valor (miles de millones)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="lg:w-1/2 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentPercentagesData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {departmentPercentagesData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          {isEditMode && (
            <div className="mt-4 flex gap-2">
              <button onClick={handleAddDepartment} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Añadir Departamento
              </button>
              <button onClick={() => handleRemoveDepartment(selectedDepartmentIndex)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                Eliminar Departamento Seleccionado
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
