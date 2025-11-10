import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const REGIONES = ["Pacifica", "Andina", "Amazonia", "Caribe", "Orinoquia"];

const HomePage: React.FC = () => {

  const handleSignOut = () => {
    signOut(auth).catch(error => console.error("Error signing out: ", error));
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col" 
      style={{ backgroundImage: "url('https://www.semana.com/resizer/ZJz-w4bS2j-3Y8aQ4E8Z-4Jz-9Y=/1280x720/smart/filters:format(jpg):quality(80)/cloudfront-us-east-1.images.arcpublishing.com/semana/5O2W2Q4Z3ZFAHNV3B3Y4E6X2Y4.jpg')" }}
    >
      <div className="bg-black bg-opacity-50 flex-grow flex flex-col items-center justify-center text-white text-center p-4">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
          Análisis de Sectores Estratégicos de Colombia
        </h1>
        <p className="text-xl md:text-2xl font-light mb-8" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
          Una mirada profunda a los motores económicos del país.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {REGIONES.map(region => (
            <Link
              key={region}
              to={`/region/${region.toLowerCase()}`}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              {region}
            </Link>
          ))}
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <button 
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default HomePage;
