import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { defaultThemes } from "../utils/assetsMap";

// Create a Context for themes
const ThemeContext = createContext();

// Function to get the current themes' status from asyncStorage
const getThemes = async () => {
  try {
    const savedThemes = await AsyncStorage.getItem("themesStatus");
    if (savedThemes) {
      const parsedThemes = JSON.parse(savedThemes);

      // Merge saved themes with default themes
      const mergedThemes = { ...defaultThemes, ...parsedThemes };

      // Save merged themes back to AsyncStorage
      await AsyncStorage.setItem("themesStatus", JSON.stringify(mergedThemes));

      return mergedThemes;
    }
    return defaultThemes;
  } catch (error) {
    console.error("Error fetching themes status:", error);
    return defaultThemes; // Return default themes in case of error
  }
};

// ThemeProvider component to manage theme state
export const ThemeProvider = ({ children }) => {
  const [themes, setThemes] = useState(null);

  //resetThemes();
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

const resetThemes = async () => {
  try {
    await AsyncStorage.removeItem("themesStatus");
    console.log("Themes reset!");
  } catch (error) {
    console.error("Error resetting themes:", error);
  }
};

// Custom hook to use theme context
export const useThemes = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemes must be used within a ThemeProvider");
  }
  return context;
};
