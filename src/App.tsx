import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import Visualizer from './Home/Visualizer';
import theme from './styles/theme';
import { ConnectionsProvider } from './store/connections/ConnectionsProvider';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConnectionsProvider>
        <Visualizer />
      </ConnectionsProvider>
    </ThemeProvider>
  );
};

export default App;
