// src/App.tsx
import { Web3ReactProvider } from '@web3-react/core';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/global';
import { Dashboard } from './components/Layout/Dashboard';
import { getLibrary } from './services/web3';

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Dashboard />
      </ThemeProvider>
    </Web3ReactProvider>
  );
}

export default App;