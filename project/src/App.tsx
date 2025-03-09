import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Vote } from 'lucide-react';
import { useEthereum } from './hooks/useEthereum';
import { VoterRegistration } from './components/VoterRegistration';
import { VoterLookup } from './components/VoterLookup';

function App() {
  const { contract, isAdmin } = useEthereum();

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Vote className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Voter Registry System</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <VoterRegistration contract={contract} isAdmin={isAdmin} />
            <VoterLookup contract={contract} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;