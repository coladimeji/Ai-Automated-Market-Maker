// src/components/Layout/Dashboard.tsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Header } from './Header';
import { MarketActivity } from '../Charts/MarketActivity';
import { TokenLiquidity } from '../Liquidity/TokenLiquidity';
import { SwapInterface } from '../Swap/SwapInterface';
import { LiquidityManagement } from '../Liquidity/LiquidityManagement';
import { ChatAssistant } from '../ChatGPT/ChatAssistant';
import { useWeb3React } from '@web3-react/core';



const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
  max-width: 1440px;
  margin: 0 auto;
`;

const TopStats = styled.div`
  grid-column: span 4;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
`;

const ChartSection = styled.div`
  grid-column: span 2;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const TradingSection = styled.div`
  grid-column: span 4;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.gradients.dark};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 15px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 242, 254, 0.1);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ theme }) => theme.gradients.primary};
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }

  .value {
    font-size: 24px;
    color: ${({ theme }) => theme.colors.primary};
    margin: 10px 0;
  }

  .label {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 14px;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 27, 35, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 242, 254, 0.1);
  border-left-color: #00f2fe;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
  padding: 12px;
  border-radius: 8px;
  margin: 10px 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  button {
    background: rgba(255, 59, 48, 0.2);
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    color: #ff3b30;
    cursor: pointer;
    
    &:hover {
      background: rgba(255, 59, 48, 0.3);
    }
  }
`;

interface StatCardData {
  value: string;
  label: string;
  change?: string;
}

const statsData: StatCardData[] = [
  { value: "5.38%", label: "APR", change: "+0.2%" },
  { value: "8.00%", label: "Daily ROI", change: "+1.5%" },
  { value: "0.83%", label: "TVL", change: "-0.1%" },
  { value: "93%", label: "Treasury", change: "+2.3%" }
];

export const Dashboard = () => {
  const { account } = useWeb3React();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState({
    stats: statsData,
    marketData: null,
    liquidityData: null
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real implementation, you would fetch actual data here
        setDashboardData({
          stats: statsData,
          marketData: null,
          liquidityData: null
        });
        
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [account]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Implement retry logic
  };

  return (
    <>
      <Header />
      {isLoading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
      
      <DashboardContainer>
        {error ? (
          <ErrorMessage>
            {error}
            <button onClick={handleRetry}>Retry</button>
          </ErrorMessage>
        ) : (
          <>
            <TopStats>
              {dashboardData.stats.map((stat, index) => (
                <StatCard key={index}>
                  <div className="value">{stat.value}</div>
                  <div className="label">{stat.label}</div>
                  {stat.change && (
                    <div className={`change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                      {stat.change}
                    </div>
                  )}
                </StatCard>
              ))}
            </TopStats>

            <ChartSection>
              <MarketActivity />
            </ChartSection>

            <ChartSection>
              <TokenLiquidity />
            </ChartSection>

            <TradingSection>
              <SwapInterface />
              <LiquidityManagement />
            </TradingSection>
          </>
        )}
      </DashboardContainer>

      <ChatAssistant />
    </>
  );
};