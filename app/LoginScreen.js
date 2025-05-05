import React, { useEffect } from "react";
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
  StatusBar,
} from "react-native";
import { useGoogleAuth } from "../utils/auth";
import { syncFromCloud } from "../utils/gameDataService";
import themeStyles from "../utils/themeStyles";
import LoadingIndicator from "../components/loadingIcon";

const LoginScreen = ({ navigation }) => {
  const { user, isLoading, promptAsync } = useGoogleAuth();

  // Sync game data after login
  useEffect(() => {
    const syncGameDataAfterLogin = async () => {
      if (user) {
        try {
          console.log("Syncing game data for user:", user.uid);
          await syncFromCloud(user.uid);
          console.log("Game data synced successfully.");
          navigation.replace("Home");
        } catch (error) {
          console.error("Error syncing game data:", error.message);
          Alert.alert(
            "Sync Error",
            "There was an error syncing your game data. Please try again later."
          );
        }
      }
    };

    syncGameDataAfterLogin();
  }, [user]);

  const handleGuestLogin = () => {
    Alert.alert(
      "Continue as Guest",
      "Your progress will not be saved if you delete the game. Are you sure you want to continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          style: "destructive",
          onPress: () => navigation.replace("Home"),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <ImageBackground
        source={require("../assets/themes/MntForest-bg.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={themeStyles.colors.blue}
          translucent={false}
        />
        <LoadingIndicator />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/themes/MntForest-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={themeStyles.colors.blue}
        translucent={false}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to PixelDoku</Text>
        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={() => promptAsync()}
        >
          <Text style={styles.buttonText}>Login with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.guestButton]}
          onPress={handleGuestLogin}
        >
          <Text style={styles.buttonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    overflow: "hidden",
    top: 0,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: themeStyles.fonts.fontFamily,
    fontSize: 36,
    textAlign: "center",
    color: themeStyles.colors.black1,
    marginBottom: 40,
  },
  button: {
    width: "70%",
    minHeight: 48,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
  },
  googleButton: {
    backgroundColor: themeStyles.colors.red,
  },
  guestButton: {
    backgroundColor: themeStyles.colors.blue,
  },
  buttonText: {
    color: "white",
    fontFamily: themeStyles.fonts.fontFamily,
    fontSize: themeStyles.fonts.headerFontSize,
  },
});

export default LoginScreen;
