import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CoinContext = createContext();

export const useCoins = () => useContext(CoinContext);

export const CoinProvider = ({ children }) => {
  const [coins, setCoins] = useState(0);

  const addCoins = async (amount) => {
    setCoins((prevCoins) => {
      const newCoins = prevCoins + amount;
      AsyncStorage.setItem("COINS", newCoins.toString()); // Store as string
      return newCoins;
    });
  };

  useEffect(() => {
    const loadCoins = async () => {
      const currentCoins = await AsyncStorage.getItem("COINS");
      if (currentCoins !== null) {
        setCoins(Number(currentCoins)); // Ensure it's a number
      }
    };

    loadCoins();
  }, []);

  return (
    <CoinContext.Provider value={{ coins, addCoins }}>
      {children}
    </CoinContext.Provider>
  );
};
