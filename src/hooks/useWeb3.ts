import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { injected } from '../services/web3';

export function useWeb3() {
  const context = useWeb3React<Web3Provider>();
  const { connector, account } = context;
  const [isLoading, setIsLoading] = useState(false);

  async function connect() {
    try {
      setIsLoading(true);
      await context.activate(injected);
    } catch (error) {
      console.error('Error connecting:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function disconnect() {
    try {
      await context.deactivate();
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }

  return { 
    account, 
    connector,
    isConnected: !!account,
    connect, 
    disconnect, 
    isLoading 
  };
}