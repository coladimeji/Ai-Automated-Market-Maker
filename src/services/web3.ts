// src/services/web3.ts
import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import { ethers } from 'ethers';

// Types
export interface ChainConfig {
  chainId: number;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

// Chain Configurations
export const SUPPORTED_CHAINS: { [chainId: number]: ChainConfig } = {
  1: {
    chainId: 1,
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/your-infura-key'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  5: {
    chainId: 5,
    chainName: 'Goerli Testnet',
    nativeCurrency: {
      name: 'Goerli Ethereum',
      symbol: 'gETH',
      decimals: 18,
    },
    rpcUrls: ['https://goerli.infura.io/v3/your-infura-key'],
    blockExplorerUrls: ['https://goerli.etherscan.io'],
  },
  // Add more networks as needed
};

// Connector Configuration
export const injected = new InjectedConnector({
  supportedChainIds: Object.keys(SUPPORTED_CHAINS).map(Number)
});

// Library Configuration
export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

// Utility Functions
export const switchNetwork = async (chainId: number) => {
  if (!window.ethereum) throw new Error('No crypto wallet found');
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [SUPPORTED_CHAINS[chainId]],
        });
      } catch (addError) {
        console.error('Error adding chain:', addError);
        throw addError;
      }
    }
    console.error('Error switching chain:', error);
    throw error;
  }
};

export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getEtherscanLink = (
  chainId: number,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string => {
  const prefix = SUPPORTED_CHAINS[chainId]?.blockExplorerUrls[0] ?? 'https://etherscan.io';

  switch (type) {
    case 'transaction':
      return `${prefix}/tx/${data}`;
    case 'token':
      return `${prefix}/token/${data}`;
    case 'address':
      return `${prefix}/address/${data}`;
    case 'block':
      return `${prefix}/block/${data}`;
    default:
      return `${prefix}`;
  }
};

// Contract Interaction Helpers
export const getContract = (
  address: string,
  abi: any,
  library: Web3Provider,
  account?: string
) => {
  if (!ethers.utils.isAddress(address) || !abi || !library) {
    throw new Error('Invalid contract parameters');
  }
  
  try {
    return new ethers.Contract(
      address,
      abi,
      account ? library.getSigner(account).connectUnchecked() : library
    );
  } catch (error) {
    console.error('Error creating contract instance:', error);
    throw error;
  }
};

// Gas Price Estimation
export const getGasPrice = async (library: Web3Provider) => {
  try {
    const gasPrice = await library.getGasPrice();
    return {
      gasPrice,
      formatted: ethers.utils.formatUnits(gasPrice, 'gwei')
    };
  } catch (error) {
    console.error('Error getting gas price:', error);
    throw error;
  }
};

// Balance Checker
export const getBalance = async (
  address: string,
  library: Web3Provider
): Promise<{
  balance: ethers.BigNumber;
  formatted: string;
}> => {
  try {
    const balance = await library.getBalance(address);
    return {
      balance,
      formatted: ethers.utils.formatEther(balance)
    };
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
};

// Transaction Helper
export const sendTransaction = async (
  library: Web3Provider,
  {
    to,
    value,
    data
  }: {
    to: string;
    value?: string;
    data?: string;
  }
) => {
  try {
    const signer = library.getSigner();
    const tx = await signer.sendTransaction({
      to,
      value: value ? ethers.utils.parseEther(value) : undefined,
      data
    });
    return tx;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};

// Event Listeners
export const setupNetworkListeners = (callback: (chainId: number) => void) => {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', (chainId: string) => {
      callback(parseInt(chainId));
    });
    return () => {
      window.ethereum.removeListener('chainChanged', callback);
    };
  }
};

export const setupAccountListeners = (callback: (accounts: string[]) => void) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', callback);
    return () => {
      window.ethereum.removeListener('accountsChanged', callback);
    };
  }
};