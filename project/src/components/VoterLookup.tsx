import React, { useState } from 'react';
import { Contract } from 'ethers';
import { Search, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface VoterLookupProps {
  contract: Contract | null;
}

interface VoterDetails {
  name: string;
  voterId: string;
  enrollmentNo: string;
  gender: string;
  isRegistered: boolean;
  hasVoted: boolean;
}

export function VoterLookup({ contract }: VoterLookupProps) {
  const [address, setAddress] = useState('');
  const [voterDetails, setVoterDetails] = useState<VoterDetails | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    try {
      const details = await contract.getVoterDetails(address);
      setVoterDetails({
        name: details[0],
        voterId: details[1],
        enrollmentNo: details[2],
        gender: details[3],
        isRegistered: details[4],
        hasVoted: details[5],
      });
    } catch (error) {
      console.error('Error looking up voter:', error);
      toast.error('Failed to lookup voter');
      setVoterDetails(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Voter Lookup</h2>
      </div>

      <form onSubmit={handleLookup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Voter Address</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Look Up Voter
        </button>
      </form>

      {voterDetails && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Voter Details</h3>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="text-sm text-gray-900">{voterDetails.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Voter ID</dt>
              <dd className="text-sm text-gray-900">{voterDetails.voterId}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Enrollment No</dt>
              <dd className="text-sm text-gray-900">{voterDetails.enrollmentNo}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Gender</dt>
              <dd className="text-sm text-gray-900">{voterDetails.gender}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Registration Status</dt>
              <dd className="text-sm text-gray-900">
                {voterDetails.isRegistered ? (
                  <span className="text-green-600">Registered</span>
                ) : (
                  <span className="text-red-600">Not Registered</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Voting Status</dt>
              <dd className="text-sm text-gray-900">
                {voterDetails.hasVoted ? (
                  <span className="text-green-600">Has Voted</span>
                ) : (
                  <span className="text-yellow-600">Voted</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}