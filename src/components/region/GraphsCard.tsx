import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Chart as ChartType, ChartDataSet } from '../../types/regionData';
import { useEditMode } from '../../context/EditModeContext';

interface GraphsCardProps {
  charts: ChartType[];
  onUpdate: (updatedCharts: ChartType[]) => void;
}

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

export const GraphsCard: React.FC<GraphsCardProps> = ({ charts, onUpdate }) => {
  const { isEditMode } = useEditMode();
  const [selectedChartIndex, setSelectedChartIndex] = useState(0);
  const [localCharts, setLocalCharts] = useState<ChartType[]>(charts);

  useEffect(() => {
    setLocalCharts(charts);
  }, [charts]);

  const currentChart = localCharts[selectedChartIndex];

  if (!currentChart) {
    return <div className="bg-white p-6 rounded-lg shadow-md">No hay gráficas disponibles para este sector.</div>;
  }

  const chartDataFormatted = currentChart.chartData.labels.map((label, index) => {
    const dataPoint: { [key: string]: any } = { name: label };
    currentChart.chartData.datasets.forEach(dataset => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });

  const updateAndPropagate = (updatedCharts: ChartType[]) => {
    setLocalCharts(updatedCharts);
    onUpdate(updatedCharts);
  };

  const handleChartPropertyChange = (
    property: 'title' | 'analysis.behavior' | 'analysis.growth',
    value: string
  ) => {
    const updatedCharts = localCharts.map((chart, index) => {
      if (index === selectedChartIndex) {
        const newChart = { ...chart };
        if (property === 'title') {
          newChart.title = value;
        } else if (property === 'analysis.behavior') {
          newChart.analysis = { ...newChart.analysis, behavior: value };
        } else if (property === 'analysis.growth') {
          newChart.analysis = { ...newChart.analysis, growth: value };
        }
        return newChart;
      }
      return chart;
    });
    updateAndPropagate(updatedCharts);
  };

  const handleLabelChange = (index: number, value: string) => {
    const updatedCharts = localCharts.map((chart, chartIdx) => {
      if (chartIdx === selectedChartIndex) {
        const newLabels = [...chart.chartData.labels];
        newLabels[index] = value;
        return {
          ...chart,
          chartData: {
            ...chart.chartData,
            labels: newLabels,
          },
        };
      }
      return chart;
    });
    updateAndPropagate(updatedCharts);
  };

  const handleAddYear = () => {
    const updatedCharts = localCharts.map((chart, chartIdx) => {
      if (chartIdx === selectedChartIndex) {
        const lastYear = parseInt(chart.chartData.labels[chart.chartData.labels.length - 1]);
        const newYear = (isNaN(lastYear) ? chart.chartData.labels.length : lastYear + 1).toString();
        
        return {
          ...chart,
          chartData: {
            ...chart.chartData,
            labels: [...chart.chartData.labels, newYear],
            datasets: chart.chartData.datasets.map(dataset => ({
              ...dataset,
              data: [...dataset.data, 0], // Add default value for new year
            })),
          },
        };
      }
      return chart;
    });
    updateAndPropagate(updatedCharts);
  };

  const handleRemoveLastYear = () => {
    const updatedCharts = localCharts.map((chart, chartIdx) => {
      if (chartIdx === selectedChartIndex && chart.chartData.labels.length > 1) {
        return {
          ...chart,
          chartData: {
            ...chart.chartData,
            labels: chart.chartData.labels.slice(0, -1),
            datasets: chart.chartData.datasets.map(dataset => ({
              ...dataset,
              data: dataset.data.slice(0, -1),
            })),
          },
        };
      }
      return chart;
    });
    updateAndPropagate(updatedCharts);
  };

  const handleDatasetPropertyChange = (
    datasetIndex: number,
    property: 'label' | 'borderColor',
    value: string
  ) => {
    const updatedCharts = localCharts.map((chart, chartIdx) => {
      if (chartIdx === selectedChartIndex) {
        const newDatasets = chart.chartData.datasets.map((dataset, dsIdx) => {
          if (dsIdx === datasetIndex) {
            return { ...dataset, [property]: value };
          }
          return dataset;
        });
        return {
          ...chart,
          chartData: { ...chart.chartData, datasets: newDatasets },
        };
      }
      return chart;
    });
    updateAndPropagate(updatedCharts);
  };

  const handleDataPointChange = (
    datasetIndex: number,
    dataIndex: number,
    value: string
  ) => {
    const updatedCharts = localCharts.map((chart, chartIdx) => {
      if (chartIdx === selectedChartIndex) {
        const newDatasets = chart.chartData.datasets.map((dataset, dsIdx) => {
          if (dsIdx === datasetIndex) {
            const newData = [...dataset.data];
            newData[dataIndex] = parseFloat(value);
            return { ...dataset, data: newData };
          }
          return dataset;
        });
        return {
          ...chart,
          chartData: { ...chart.chartData, datasets: newDatasets },
        };
      }
      return chart;
    });
    updateAndPropagate(updatedCharts);
  };

  const handleAddDataset = () => {
    const updatedCharts = localCharts.map((chart, chartIdx) => {
      if (chartIdx === selectedChartIndex) {
        const newDataset: ChartDataSet = {
          label: `Nueva Serie ${chart.chartData.datasets.length + 1}`,
          data: Array(chart.chartData.labels.length).fill(0),
          borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color
          backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}80`, // Random color with alpha
          type: 'line',
          yAxisID: chart.chartData.datasets.length % 2 === 0 ? 'y' : 'y1', // Alternate y-axis
        };
        return {
          ...chart,
          chartData: {
            ...chart.chartData,
            datasets: [...chart.chartData.datasets, newDataset],
          },
        };
      }
      return chart;
    });
    updateAndPropagate(updatedCharts);
  };

  const handleRemoveDataset = (datasetIndex: number) => {
    const updatedCharts = localCharts.map((chart, chartIdx) => {
      if (chartIdx === selectedChartIndex) {
        return {
          ...chart,
          chartData: {
            ...chart.chartData,
            datasets: chart.chartData.datasets.filter((_, dsIdx) => dsIdx !== datasetIndex),
          },
        };
      }
      return chart;
    });
    updateAndPropagate(updatedCharts);
  };

  const handleAddChart = () => {
    const newChart: ChartType = JSON.parse(JSON.stringify(currentChart)); // Deep copy
    newChart.title = `Copia de ${newChart.title}`;
    updateAndPropagate([...localCharts, newChart]);
    setSelectedChartIndex(localCharts.length); // Select the new chart
  };

  const handleRemoveChart = () => {
    if (localCharts.length <= 1) {
      alert("No puedes eliminar el último gráfico.");
      return;
    }
    const updatedCharts = localCharts.filter((_, chartIdx) => chartIdx !== selectedChartIndex);
    updateAndPropagate(updatedCharts);
    setSelectedChartIndex(0); // Select the first chart after deletion
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Gráficas</h2>

      {localCharts.length > 1 && (
        <div className="mb-4">
          <label htmlFor="chart-select" className="block text-gray-700 text-sm font-bold mb-2">
            Seleccionar Gráfica:
          </label>
          <select
            id="chart-select"
            value={selectedChartIndex}
            onChange={(e) => setSelectedChartIndex(parseInt(e.target.value))}
            className="block w-full md:w-1/2 lg:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          >
            {localCharts.map((chart, index) => (
              <option key={index} value={index}>
                {chart.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {isEditMode ? (
        <input
          type="text"
          className="text-xl font-semibold mb-4 w-full p-2 border border-gray-300 rounded-md"
          value={currentChart.title}
          onChange={(e) => handleChartPropertyChange('title', e.target.value)}
        />
      ) : (
        <h3 className="text-xl font-semibold mb-4">{currentChart.title}</h3>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartDataFormatted}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {currentChart.chartData.datasets.map((dataset: ChartDataSet, index: number) => (
                <Line
                  key={index}
                  yAxisId={dataset.yAxisID === 'y' ? 'left' : 'right'}
                  type="monotone"
                  dataKey={dataset.label}
                  stroke={dataset.borderColor}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:w-1/3 space-y-4">
          <div>
            <h4 className="font-bold text-lg">Análisis de Comportamiento:</h4>
            {isEditMode ? (
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                value={currentChart.analysis.behavior}
                onChange={(e) => handleChartPropertyChange('analysis.behavior', e.target.value)}
                rows={4}
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-line">{currentChart.analysis.behavior}</p>
            )}
          </div>
          <div>
            <h4 className="font-bold text-lg">Análisis de Impacto:</h4>
            {isEditMode ? (
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                value={currentChart.analysis.growth}
                onChange={(e) => handleChartPropertyChange('analysis.growth', e.target.value)}
                rows={4}
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-line">{currentChart.analysis.growth}</p>
            )}
          </div>
        </div>
      </div>

      {isEditMode && (
        <div className="mt-8 border-t pt-4">
          <h4 className="font-bold text-lg mb-4">Editar Años y Datos:</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {currentChart.chartData.labels.map((label, index) => (
              <input
                key={index}
                type="text"
                className="w-20 p-1 border border-gray-300 rounded-md text-sm"
                value={label}
                onChange={(e) => handleLabelChange(index, e.target.value)}
              />
            ))}
          </div>
          <div className="flex gap-2 mb-4">
            <button onClick={handleAddYear} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Añadir Año
            </button>
            <button onClick={handleRemoveLastYear} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
              Eliminar Último Año
            </button>
          </div>

          <h5 className="font-bold text-md mt-4">Editar Series de Datos:</h5>
          {currentChart.chartData.datasets.map((dataset, datasetIndex) => (
            <div key={datasetIndex} className="mb-4 p-3 border border-gray-200 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  className="w-1/3 p-1 border border-gray-300 rounded-md text-sm"
                  value={dataset.label}
                  onChange={(e) => handleDatasetPropertyChange(datasetIndex, 'label', e.target.value)}
                  placeholder="Nombre de la Serie"
                />
                <input
                  type="color"
                  className="w-10 h-8 border-none rounded-md"
                  value={dataset.borderColor}
                  onChange={(e) => handleDatasetPropertyChange(datasetIndex, 'borderColor', e.target.value)}
                  title="Color de la Línea"
                />
                <button 
                  onClick={() => handleRemoveDataset(datasetIndex)}
                  className="px-2 py-1 bg-red-400 text-white rounded-md text-sm hover:bg-red-500"
                >
                  Eliminar Serie
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {dataset.data.map((value, dataIndex) => (
                  <input
                    key={dataIndex}
                    type="number"
                    className="w-20 p-1 border border-gray-300 rounded-md text-sm"
                    value={value}
                    onChange={(e) => handleDataPointChange(datasetIndex, dataIndex, e.target.value)}
                  />
                ))}
              </div>
            </div>
          ))}
          <button 
            onClick={handleAddDataset}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Añadir Serie
          </button>

          <div className="mt-8 border-t pt-4">
            <h4 className="font-bold text-lg mb-4">Gestionar Gráficos:</h4>
            <button 
              onClick={handleAddChart}
              className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 mr-2"
            >
              Añadir Gráfico
            </button>
            <button 
              onClick={handleRemoveChart}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Eliminar Gráfico Seleccionado
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
