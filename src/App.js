import React from 'react';
import { Toaster } from 'react-hot-toast';
import EnergyAuditForm from './components/EnergyAuditForm';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Energy Audit Proposal Generator
          </h1>
          <p className="text-lg text-gray-600">
            Create professional energy audit proposals with dynamic content and payment schedules
          </p>
        </header>
        
        <EnergyAuditForm />
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;