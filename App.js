import React, { useState, useEffect } from "react";
import HomeScreen from "./app/HomeScreen";
import SudokuScreen from "./app/SudokuScreen";
import NotFoundScreen from "./app/NotFoundScreen";
import { CoinProvider } from "./utils/coinContext";
import { GameProvider } from "./utils/gameContext";
import { HighScoreProvider } from "./utils/highscoreContext";
import * as Font from "expo-font";
import LoadingIndicator from "./components/loadingIcon";
import { ThemeProvider } from "./utils/themeContext";

const App = () => {
  const [currentScreen, setCurrentScreen] = useState({
    name: "Home",
    params: null,
  });

  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      "Silkscreen-Regular": require("./assets/fonts/Silkscreen-Regular.ttf"),
      "Silkscreen-Bold": require("./assets/fonts/Silkscreen-Bold.ttf"),
    });
  };

  useEffect(() => {
    loadFonts()
      .then(() => {
        console.log("Fonts loaded successfully");
        setFontsLoaded(true);
      })
      .catch((error) => console.error("Error loading fonts:", error));
  }, []);

  if (!fontsLoaded) {
    return <LoadingIndicator />;
  }

  const navigate = (screenName, params = null) => {
    setCurrentScreen({ name: screenName, params });
  };

  return (
    <ThemeProvider>
      <GameProvider>
        <HighScoreProvider>
          <CoinProvider>
            {/* Conditional Screen Rendering */}
            {currentScreen.name === "Home" && (
              <HomeScreen navigation={{ navigate }} />
            )}
            {currentScreen.name === "SudokuScreen" && (
              <SudokuScreen
                route={{ params: currentScreen.params }}
                navigation={{ navigate }}
              />
            )}
            {currentScreen.name !== "Home" &&
              currentScreen.name !== "SudokuScreen" && (
                <NotFoundScreen navigation={{ navigate }} /> // Render Not Found
              )}
          </CoinProvider>
        </HighScoreProvider>
      </GameProvider>
    </ThemeProvider>
  );
};

export default App;
