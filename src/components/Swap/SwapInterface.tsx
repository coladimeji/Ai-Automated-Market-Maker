// src/components/Swap/SwapInterface.tsx
import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

// Types
interface Token {
  symbol: string;
  address: string;
  decimals: number;
  logo?: string;
}

interface SwapState {
  loading: boolean;
  error: string | null;
  txHash: string | null;
}

// Token List
const TOKENS: Token[] = [
  { symbol: 'ETH', address: 'ETH', decimals: 18 },
  { symbol: 'USDT', address: '0x...', decimals: 6 },
  { symbol: 'USDC', address: '0x...', decimals: 6 },
  { symbol: 'DAI', address: '0x...', decimals: 18 },
];

// Styled Components
const SwapContainer = styled.div`
  background: rgba(26, 27, 35, 0.95);
  border-radius: 15px;
  padding: 20px;
  width: 100%;
  max-width: 480px;
  margin: 20px auto;
`;

const SwapCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  margin: 10px 0;
  position: relative;
`;

const TokenInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  padding: 12px;
  color: white;
  width: 100%;
  font-size: 18px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TokenSelect = styled.button`
  background: rgba(0, 242, 254, 0.1);
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  color: #00f2fe;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgba(0, 242, 254, 0.2);
  }

  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
`;

const SwapButton = styled.button<{ $isError?: boolean }>`
  background: ${({ $isError }) => 
    $isError 
      ? 'linear-gradient(45deg, #ff4b4b, #ff6666)' 
      : 'linear-gradient(45deg, #00f2fe, #4facfe)'};
  border: none;
  border-radius: 12px;
  padding: 16px;
  color: white;
  width: 100%;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 242, 254, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SwapInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px;
  margin: 10px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};

  .row {
    display: flex;
    justify-content: space-between;
    margin: 4px 0;
  }
`;

const SwapArrow = styled.button`
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ theme }) => theme.colors.background};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  color: ${({ theme }) => theme.colors.primary};
  transition: all 0.3s ease;

  &:hover {
    transform: translate(-50%, -50%) rotate(180deg);
  }
`;

const ErrorMessage = styled.div`
  color: #ff4b4b;
  padding: 8px;
  margin: 8px 0;
  border-radius: 8px;
  background: rgba(255, 75, 75, 0.1);
  font-size: 14px;
`;

const SettingsButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: 8px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const SwapInterface = () => {
  const { account, library } = useWeb3React();
  const [fromToken, setFromToken] = useState<Token>(TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(TOKENS[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [swapState, setSwapState] = useState<SwapState>({
    loading: false,
    error: null,
    txHash: null
  });

  useEffect(() => {
    if (fromAmount) {
      calculateToAmount(fromAmount);
    }
  }, [fromAmount, fromToken, toToken]);

  const calculateToAmount = async (amount: string) => {
    try {
      // In a real implementation, you would:
      // 1. Call your AMM contract to get the actual rate
      // 2. Consider liquidity depth
      // 3. Calculate price impact
      const mockRate = fromToken.symbol === 'ETH' ? 1800 : 1/1800;
      const calculated = parseFloat(amount) * mockRate;
      setToAmount(calculated.toFixed(toToken.decimals));
    } catch (error) {
      console.error('Error calculating amount:', error);
      setSwapState(prev => ({ ...prev, error: 'Error calculating rate' }));
    }
  };

  const handleSwap = async () => {
    if (!account || !library) {
      setSwapState(prev => ({ ...prev, error: 'Please connect your wallet' }));
      return;
    }

    setSwapState({ loading: true, error: null, txHash: null });

    try {
      // Here you would:
      // 1. Get contract instances
      // 2. Check allowances
      // 3. Execute approve if needed
      // 4. Execute swap
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSwapState(prev => ({
        ...prev,
        loading: false,
        txHash: '0x...' // Mock transaction hash
      }));
    } catch (error) {
      console.error('Swap error:', error);
      setSwapState({
        loading: false,
        error: 'Failed to execute swap',
        txHash: null
      });
    }
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const getSwapButtonText = () => {
    if (!account) return 'Connect Wallet';
    if (swapState.loading) return 'Swapping...';
    if (!fromAmount) return 'Enter Amount';
    return 'Swap';
  };

  return (
    <SwapContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Swap Tokens</h3>
        <SettingsButton onClick={() => console.log('Open settings')}>⚙️</SettingsButton>
      </div>
      
      <SwapCard>
        <TokenInput>
          <Input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.0"
            disabled={swapState.loading}
          />
          <TokenSelect>
            {fromToken.logo && <img src={fromToken.logo} alt={fromToken.symbol} />}
            {fromToken.symbol}
            <span>▼</span>
          </TokenSelect>
        </TokenInput>
      </SwapCard>

      <SwapArrow onClick={switchTokens}>↓</SwapArrow>

      <SwapCard>
        <TokenInput>
          <Input
            type="number"
            value={toAmount}
            readOnly
            placeholder="0.0"
          />
          <TokenSelect>
            {toToken.logo && <img src={toToken.logo} alt={toToken.symbol} />}
            {toToken.symbol}
            <span>▼</span>
          </TokenSelect>
        </TokenInput>
      </SwapCard>

      {swapState.error && (
        <ErrorMessage>{swapState.error}</ErrorMessage>
      )}

      <SwapInfo>
        <div className="row">
          <span>Rate</span>
          <span>1 {fromToken.symbol} = {fromToken.symbol === 'ETH' ? '1800' : '0.00056'} {toToken.symbol}</span>
        </div>
        <div className="row">
          <span>Slippage Tolerance</span>
          <span>{slippage}%</span>
        </div>
        <div className="row">
          <span>Network Fee</span>
          <span>~$5.00</span>
        </div>
        {parseFloat(fromAmount) > 0 && (
          <div className="row">
            <span>Price Impact</span>
            <span>0.05%</span>
          </div>
        )}
      </SwapInfo>

      <SwapButton 
        onClick={handleSwap}
        disabled={!fromAmount || parseFloat(fromAmount) <= 0 || swapState.loading}
        $isError={!!swapState.error}
      >
        {getSwapButtonText()}
      </SwapButton>

      {swapState.txHash && (
        <SwapInfo>
          <div className="row">
            <span>Transaction Hash:</span>
            <a href={`https://etherscan.io/tx/${swapState.txHash}`} target="_blank" rel="noopener noreferrer">
              View on Etherscan
            </a>
          </div>
        </SwapInfo>
      )}
    </SwapContainer>
  );
};