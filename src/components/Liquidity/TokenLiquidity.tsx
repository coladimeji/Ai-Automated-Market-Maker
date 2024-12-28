import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const LiquidityContainer = styled.div`
  background: rgba(26, 27, 35, 0.95);
  border-radius: 15px;
  padding: 20px;
  height: 400px;
`;

const LiquidityStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
`;

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  
  .label {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 14px;
  }
  
  .value {
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 18px;
    margin-top: 5px;
  }
`;

const COLORS = ['#00f2fe', '#4facfe', '#00f2fe', '#4facfe'];

const mockData = [
  { name: 'ETH', value: 400 },
  { name: 'USDT', value: 300 },
  { name: 'BTC', value: 200 },
  { name: 'Other', value: 100 }
];

export const TokenLiquidity = () => {
  return (
    <LiquidityContainer>
      <h3>Token Liquidity</h3>
      <LiquidityStats>
        <StatItem>
          <div className="label">Total Liquidity</div>
          <div className="value">$1,000,000</div>
        </StatItem>
        <StatItem>
          <div className="label">24h Volume</div>
          <div className="value">$250,000</div>
        </StatItem>
      </LiquidityStats>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={mockData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {mockData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </LiquidityContainer>
  );
};