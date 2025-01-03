import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { defaultThemes } from "../utils/helper";

// Create a Context for themes
const ThemeContext = createContext();

// Function to get the current themes' status from asyncStorage
const getThemes = async () => {
  try {
    const savedThemes = await AsyncStorage.getItem("themesStatus");
    if (savedThemes) {
      return JSON.parse(savedThemes); // Return saved themes if available
    }
    return defaultThemes; // Return default status if nothing is saved
  } catch (error) {
    console.error("Error fetching themes status:", error);
    return defaultThemes; // Return default status in case of error
  }
};

// ThemeProvider component to manage theme state
export const ThemeProvider = ({ children }) => {
  const [themes, setThemes] = useState(null);

  // Load themes when the provider mounts
  useEffect(() => {
    const fetchThemes = async () => {
      const loadedThemes = await getThemes();
      setThemes(loadedThemes);
    };
    fetchThemes();
  }, []);

  // Function to unlock a theme
  const unlockTheme = async (themeKey) => {
    try {
      const updatedThemes = { ...themes };
      const theme = updatedThemes[themeKey];

      if (theme && theme.locked) {
        theme.locked = false; // Unlock the theme
        await AsyncStorage.setItem(
          "themesStatus",
          JSON.stringify(updatedThemes)
        );
        console.log(`${themeKey} unlocked!`);
        setThemes(updatedThemes); // Update the state after unlocking the theme
      } else if (theme && !theme.locked) {
        console.log(`${themeKey} is already unlocked.`);
      } else {
        console.log("Theme not found.");
      }
    } catch (error) {
      console.error("Error unlocking theme:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ themes, unlockTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useThemes = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemes must be used within a ThemeProvider");
  }
  return context;
};
