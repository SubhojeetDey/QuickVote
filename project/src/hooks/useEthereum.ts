import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, JsonRpcSigner } from 'ethers';
import { VOTER_REGISTRY_ABI, CONTRACT_ADDRESS } from '../contracts/VoterRegistry';
import toast from 'react-hot-toast';

export function useEthereum() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [account, setAccount] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Initialize provider
          const provider = new BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();
          
          // Initialize contract with signer for write operations
          const contract = new Contract(CONTRACT_ADDRESS, VOTER_REGISTRY_ABI, signer);
          const admin = await contract.admin();
          
          setProvider(provider);
          setSigner(signer);
          setContract(contract);
          setAccount(accounts[0]);
          setIsAdmin(accounts[0].toLowerCase() === admin.toLowerCase());

          // Handle account changes
          window.ethereum.on('accountsChanged', async (newAccounts: string[]) => {
            if (newAccounts.length > 0) {
              const newSigner = await provider.getSigner();
              const newContract = new Contract(CONTRACT_ADDRESS, VOTER_REGISTRY_ABI, newSigner);
              const admin = await newContract.admin();

              setSigner(newSigner);
              setContract(newContract);
              setAccount(newAccounts[0]);
              setIsAdmin(newAccounts[0].toLowerCase() === admin.toLowerCase());
            } else {
              // Handle disconnection
              setSigner(null);
              setContract(null);
              setAccount('');
              setIsAdmin(false);
            }
          });

        } catch (error) {
          console.error('Error initializing ethereum:', error);
          // Handle initialization error gracefully
          toast.error('Failed to connect to Ethereum network');
        }
      } else {
        toast.error('Please install MetaMask to use this application');
      }
    };

    init();

    // Cleanup function
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  return { provider, signer, contract, account, isAdmin };
}