// App.js

import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./app/LoginScreen";
import HomeScreen from "./app/HomeScreen";
import SudokuScreen from "./app/SudokuScreen";
import NotFoundScreen from "./app/NotFoundScreen";
import * as Font from "expo-font";
import LoadingIndicator from "./components/loadingIcon";
import Header from "./components/Header";
import mobileAds from "react-native-google-mobile-ads";
import { withIAPContext } from "react-native-iap";
import { PlayerDataProvider } from "./utils/playerDataContext";
import { GameProvider } from "./utils/gameContext";
import { MusicProvider } from "./utils/musicContext";

const Stack = createStackNavigator();

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts asynchronously
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "Silkscreen-Regular": require("./assets/fonts/Silkscreen-Regular.ttf"),
          "Silkscreen-Bold": require("./assets/fonts/Silkscreen-Bold.ttf"),
        });
        console.log("[PixelDokuLogs] Fonts loaded successfully");
        setFontsLoaded(true);
      } catch (error) {
        console.error("[PixelDokuLogs] Error loading fonts:", error);
      }
    }

    loadFonts();
  }, []);

  // Initialize Google Mobile Ads SDK once
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
    <PlayerDataProvider>
      <GameProvider>
        <MusicProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Sudoku"
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
                      onBackPress={() => navigation.goBack()}
                    />
                  ),
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </MusicProvider>
      </GameProvider>
    </PlayerDataProvider>
  );
};

export default withIAPContext(App);
