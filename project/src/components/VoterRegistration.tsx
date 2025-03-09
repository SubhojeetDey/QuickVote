import React, { useState } from 'react';
import { Contract } from 'ethers';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

interface VoterRegistrationProps {
  contract: Contract | null;
  isAdmin: boolean;
}

export function VoterRegistration({ contract, isAdmin }: VoterRegistrationProps) {
  const [formData, setFormData] = useState({
    voterAddress: '',
    name: '',
    voterId: '',
    enrollmentNo: '',
    gender: '',
    aadharNo: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isAdmin) return;

    try {
      const tx = await contract.registerVoter(
        formData.voterAddress,
        formData.name,
        formData.voterId,
        formData.enrollmentNo,
        formData.gender,
        formData.aadharNo
      );
      
      toast.promise(tx.wait(), {
        loading: 'Registering voter...',
        success: 'Voter registered successfully!',
        error: 'Failed to register voter',
      });

      // Clear form after successful registration
      setFormData({
        voterAddress: '',
        name: '',
        voterId: '',
        enrollmentNo: '',
        gender: '',
        aadharNo: '',
      });
    } catch (error) {
      console.error('Error registering voter:', error);
      toast.error('Failed to register voter');
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center text-red-600">
          Only admin can register voters
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Register New Voter</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Voter Address</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.voterAddress}
            onChange={(e) => setFormData({ ...formData, voterAddress: e.target.value })}
            placeholder="0x..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Voter ID</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.voterId}
            onChange={(e) => setFormData({ ...formData, voterId: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Enrollment Number</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.enrollmentNo}
            onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.aadharNo}
            onChange={(e) => setFormData({ ...formData, aadharNo: e.target.value })}
            required
            pattern="[0-9]{12}"
            title="Please enter a valid 12-digit Aadhar number"
            placeholder="123456789012"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Register Voter
        </button>
      </form>
    </div>
  );
}