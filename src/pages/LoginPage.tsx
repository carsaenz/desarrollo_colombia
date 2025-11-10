import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Bienvenido</h1>
        <p className="mb-6 text-gray-600">Inicia sesión para continuar</p>
        <button
          onClick={handleGoogleSignIn}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center w-full"
        >
          <svg className="w-6 h-6 mr-2" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.35 6.48C12.73 13.72 17.9 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v8.51h12.8c-.57 3.02-2.28 5.48-4.79 7.2l8.35 6.48c4.87-4.49 7.64-11.02 7.64-18.14z"></path>
            <path fill="#FBBC05" d="M10.91 28.19c-.52-1.57-.82-3.24-.82-5.04s.3-3.47.82-5.04l-8.35-6.48C.73 14.62 0 19.21 0 24s.73 9.38 2.56 12.66l8.35-6.47z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-8.35-6.48c-2.15 1.45-4.92 2.3-8.54 2.3-6.1 0-11.27-4.22-13.09-9.92l-8.35 6.48C6.51 42.62 14.62 48 24 48z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
