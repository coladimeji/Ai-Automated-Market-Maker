// src/components/Layout/Header.tsx
import styled from 'styled-components';
import { useWeb3 } from '../../hooks/useWeb3';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: ${({ theme }) => theme.colors.surface};
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ConnectButton = styled.button`
  background: ${({ theme }) => theme.gradients.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 10px 20px;
  color: white;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const Header: React.FC = () => {
  const { account, connect, disconnect } = useWeb3();

  return (
    <HeaderContainer>
      <Logo>AI Automated Market Maker</Logo>
      <ConnectButton onClick={account ? disconnect : connect}>
        {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
      </ConnectButton>
    </HeaderContainer>
  );
};  