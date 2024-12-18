import React, { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import SudokuScreen from './screens/SudokuScreen';
import './styles/styles.scss';
import { CoinProvider } from './utils/coinContext';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState({
    name: 'Home',
    params: null,
  });

  const navigate = (screenName, params = null) => {
    setCurrentScreen({ name: screenName, params });
  };

  return (
    <CoinProvider>
      {/* Conditional Screen Rendering */}
      {currentScreen.name === 'Home' && <HomeScreen navigation={{ navigate }} />}
      {currentScreen.name === 'SudokuScreen' && (
        <SudokuScreen
          route={{ params: currentScreen.params }}
          navigation={{ navigate }}
        />
      )}
    </CoinProvider>
  );
};

export default App;
