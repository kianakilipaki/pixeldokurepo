import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./app/HomeScreen";
import SudokuScreen from "./app/SudokuScreen";
import NotFoundScreen from "./app/NotFoundScreen";
import { CoinProvider } from "./utils/coinContext";
import { GameProvider } from "./utils/gameContext";
import { HighScoreProvider } from "./utils/highscoreContext";
import * as Font from "expo-font";
import LoadingIndicator from "./components/loadingIcon";
import { ThemeProvider } from "./utils/themeContext";
import { MusicProvider } from "./utils/musicContext";
import Header from "./components/Header";

const Stack = createStackNavigator();

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts asynchronously
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

  // Initialize Google Mobile Ads SDK, ensuring it's only done once
  useEffect(() => {
    const initializeAds = async () => {
      await mobileAds().initialize();
    };
    initializeAds();
  }, []);

  if (!fontsLoaded) {
    return <LoadingIndicator />;
  }

  return (
    <ThemeProvider>
      <MusicProvider>
        <GameProvider>
          <HighScoreProvider>
            <CoinProvider>
              <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                  <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }} // Hide header if needed
                  />
                  <Stack.Screen
                    name="SudokuScreen"
                    component={SudokuScreen}
                    options={({ route, navigation }) => ({
                      header: () => (
                        <Header
                          title={route.params?.theme?.title || "Sudoku"}
                          onBackPress={() => navigation.goBack()}
                        />
                      ),
                    })}
                  />
                  <Stack.Screen
                    name="NotFound"
                    component={NotFoundScreen}
                    options={{
                      header: ({ navigation }) => (
                        <Header
                          title="Page Not Found"
                          onBackPress={() => navigation.goBack()} // Go back when needed
                        />
                      ),
                    }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </CoinProvider>
          </HighScoreProvider>
        </GameProvider>
      </MusicProvider>
    </ThemeProvider>
  );
};

export default App;
