// src/components/Liquidity/LiquidityManagement.tsx
import { useState } from 'react';
import styled from 'styled-components';

const LiquidityContainer = styled.div`
  background: rgba(26, 27, 35, 0.95);
  border-radius: 15px;
  padding: 20px;
  width: 100%;
  max-width: 480px;
  margin: 20px auto;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ active: boolean }>`
  background: ${({ active }) => 
    active ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  color: ${({ active }) => active ? '#00f2fe' : '#8b8ca7'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 242, 254, 0.1);
  }
`;

const LiquidityInput = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  margin: 10px 0;
`;

const TokenPairInput = styled.div`
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
`;

const ActionButton = styled.button`
  background: linear-gradient(45deg, #00f2fe, #4facfe);
  border: none;
  border-radius: 12px;
  padding: 16px;
  color: white;
  width: 100%;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PoolInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px;
  margin: 10px 0;

  .row {
    display: flex;
    justify-content: space-between;
    margin: 8px 0;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const LiquidityManagement = () => {
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add');
  const [token1Amount, setToken1Amount] = useState('');
  const [token2Amount, setToken2Amount] = useState('');

  const handleAddLiquidity = async () => {
    // Implement add liquidity logic
    console.log('Adding liquidity');
  };

  const handleRemoveLiquidity = async () => {
    // Implement remove liquidity logic
    console.log('Removing liquidity');
  };

  return (
    <LiquidityContainer>
      <h3>Liquidity Management</h3>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'add'} 
          onClick={() => setActiveTab('add')}
        >
          Add Liquidity
        </Tab>
        <Tab 
          active={activeTab === 'remove'} 
          onClick={() => setActiveTab('remove')}
        >
          Remove Liquidity
        </Tab>
      </TabContainer>

      {activeTab === 'add' ? (
        <>
          <LiquidityInput>
            <TokenPairInput>
              <Input
                type="number"
                value={token1Amount}
                onChange={(e) => setToken1Amount(e.target.value)}
                placeholder="0.0"
              />
              <span>ETH</span>
            </TokenPairInput>
            
            <TokenPairInput>
              <Input
                type="number"
                value={token2Amount}
                onChange={(e) => setToken2Amount(e.target.value)}
                placeholder="0.0"
              />
              <span>USDT</span>
            </TokenPairInput>
          </LiquidityInput>

          <PoolInfo>
            <div className="row">
              <span>Pool Share</span>
              <span>0.00%</span>
            </div>
            <div className="row">
              <span>Pool Rate</span>
              <span>1 ETH = 1800 USDT</span>
            </div>
          </PoolInfo>

          <ActionButton 
            onClick={handleAddLiquidity}
            disabled={!token1Amount || !token2Amount}
          >
            Add Liquidity
          </ActionButton>
        </>
      ) : (
        <>
          <LiquidityInput>
            <TokenPairInput>
              <Input
                type="number"
                placeholder="Amount to remove"
              />
              <span>LP Tokens</span>
            </TokenPairInput>
          </LiquidityInput>

          <PoolInfo>
            <div className="row">
              <span>Your Pool Share</span>
              <span>2.5%</span>
            </div>
            <div className="row">
              <span>You will receive</span>
              <span>0.5 ETH + 900 USDT</span>
            </div>
          </PoolInfo>

          <ActionButton onClick={handleRemoveLiquidity}>
            Remove Liquidity
          </ActionButton>
        </>
      )}
    </LiquidityContainer>
  );
};