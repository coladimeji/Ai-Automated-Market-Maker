// src/components/Charts/MarketActivity.tsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ChartContainer = styled.div`
  background: rgba(26, 27, 35, 0.95);
  border-radius: 15px;
  padding: 20px;
`;

const TimeframeButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const TimeButton = styled.button<{ active: boolean }>`
  background: ${({ active }) => 
    active ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  color: ${({ active }) => 
    active ? '#00f2fe' : '#8b8ca7'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 242, 254, 0.1);
  }
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PriceInfo = styled.div`
  .current-price {
    font-size: 24px;
    color: #00f2fe;
  }
  
  .price-change {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

// Mock data generator
const generateChartData = (hours: number) => {
  const data = [];
  const now = Date.now();
  for (let i = hours; i >= 0; i--) {
    data.push({
      time: now - i * 3600000,
      value: 1000 + Math.random() * 600
    });
  }
  return data;
};

export const MarketActivity = () => {
  const [timeframe, setTimeframe] = useState('24H');
  const [chartData, setChartData] = useState(generateChartData(24));
  const [currentPrice, setCurrentPrice] = useState(1200);
  const [priceChange, setPriceChange] = useState(2.5);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = [...chartData];
      const newPrice = currentPrice + (Math.random() - 0.5) * 20;
      
      newData.push({
        time: Date.now(),
        value: newPrice
      });
      
      if (newData.length > 100) newData.shift();
      
      setChartData(newData);
      setCurrentPrice(newPrice);
      setPriceChange((newPrice - chartData[0].value) / chartData[0].value * 100);
    }, 5000);

    return () => clearInterval(interval);
  }, [chartData, currentPrice]);

  return (
    <ChartContainer>
      <ChartHeader>
        <h3>Market Activity</h3>
        <PriceInfo>
          <div className="current-price">${currentPrice.toFixed(2)}</div>
          <div className="price-change">
            {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%
          </div>
        </PriceInfo>
      </ChartHeader>

      <TimeframeButtons>
        {['1H', '24H', '1W', '1M', 'ALL'].map(tf => (
          <TimeButton
            key={tf}
            active={timeframe === tf}
            onClick={() => setTimeframe(tf)}
          >
            {tf}
          </TimeButton>
        ))}
      </TimeframeButtons>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time"
            tickFormatter={(time) => new Date(time).toLocaleTimeString()}
            stroke="#8b8ca7"
          />
          <YAxis stroke="#8b8ca7" />
          <Tooltip
            contentStyle={{
              background: 'rgba(26, 27, 35, 0.9)',
              border: 'none',
              borderRadius: '8px',
              color: 'white'
            }}
            labelFormatter={(label) => new Date(label).toLocaleString()}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#00f2fe"
            fill="url(#colorValue)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};