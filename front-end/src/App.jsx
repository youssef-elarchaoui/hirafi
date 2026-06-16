// src/App.jsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <>
          <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#3D5A3E',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#B84A3A',
              secondary: '#fff',
            },
          },
        }}
      />
    <AuthProvider>
      <SocketProvider>
      <RouterProvider router={router} />
      </SocketProvider>
    </AuthProvider>
  </>
  );
}

export default App;