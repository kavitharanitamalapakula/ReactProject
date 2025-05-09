import React, { Suspense, lazy } from 'react';
import './App.css';
import Loader from './Components/LandingPage/Loader';
import { Routes, Route } from 'react-router-dom';

const AuthPage = lazy(() => import('./Components/LandingPage/AuthPage'));
const Dashboard = lazy(() => import('./Components/Dashboard/Dashboard'));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}

export default App;
