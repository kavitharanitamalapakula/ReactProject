import React, { Suspense, lazy } from 'react';
import './App.css';
import Loader from './Components/LandingPage/Loader';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MeetingRoom from './Components/Dashboard/MeetingRoom';

const AuthPage = lazy(() => import('./Components/LandingPage/AuthPage'));
const Dashboard = lazy(() => import('./Components/Dashboard/Dashboard'));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meeting/:roomId" element={<MeetingRoom />} />
      </Routes>
    </Suspense>
  );
}

export default App;
