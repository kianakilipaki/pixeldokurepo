import React, { createContext, useState, useContext } from 'react';

const CoinContext = createContext();

export const useCoins = () => useContext(CoinContext);

export const CoinProvider = ({ children }) => {
  const [coins, setCoins] = useState(0);

  const addCoins = (amount) => {
    setCoins((prevCoins) => prevCoins + amount);
  };

  return (
    <CoinContext.Provider value={{ coins, addCoins }}>
      {children}
    </CoinContext.Provider>
  );
};
