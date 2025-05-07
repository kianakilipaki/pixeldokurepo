import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
  StatusBar,
  Image,
} from "react-native";
import { useGoogleAuth } from "../utils/auth";
import {
  migrateLocalGameData,
  syncFromCloud,
} from "../utils/playerDataService";
import themeStyles from "../utils/themeStyles";
import LoadingIndicator from "../components/loadingIcon";
import { AntDesign } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
  const { user, isLoading, promptAsync } = useGoogleAuth();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const syncGameDataAfterLogin = async () => {
      if (user) {
        setIsSyncing(true);
        try {
          console.log("[PixelDokuLogs] Syncing game data for user:", user.uid);
          await migrateLocalGameData(user.uid);
          await syncFromCloud(user.uid);
          console.log("[PixelDokuLogs] Game data synced successfully.");
          navigation.replace("Home");
        } catch (error) {
          console.error(
            "[PixelDokuLogs] Error syncing game data:",
            error.message
          );
          Alert.alert(
            "Sync Error",
            "There was an error syncing your game data. Please try again later."
          );
        } finally {
          setIsSyncing(false);
        }
      }
    };

    syncGameDataAfterLogin();
  }, [user]);

  const handleGuestLogin = async () => {
    await migrateLocalGameData();
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

  if (isLoading || isSyncing) {
    return (
      <ImageBackground
        source={require("../assets/themes/MntForest-bg.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={themeStyles.colors.blue}
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
      />
      <View style={styles.container}>
        <Image source={require("../assets/icon-bg.png")} style={styles.logo} />
        <Text style={styles.header}>Welcome to</Text>
        <Text style={styles.title}>PixelDoku</Text>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => promptAsync()}
        >
          <AntDesign name="google" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleGuestLogin}>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
  },
  header: {
    fontFamily: themeStyles.fonts.fontFamily,
    fontSize: 36,
    textAlign: "center",
    color: themeStyles.colors.black1,
  },
  title: {
    fontFamily: themeStyles.fonts.fontFamily,
    fontSize: 48,
    marginBottom: 20,
    color: themeStyles.colors.red,
    transform: [{ scaleY: 2 }],
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeStyles.colors.blue,
    marginTop: 40,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  googleText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: themeStyles.fonts.fontFamily,
  },
  guestText: {
    marginTop: 20,
    fontSize: 14,
    color: themeStyles.colors.white,
    textDecorationLine: "underline",
    fontFamily: themeStyles.fonts.fontFamily,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    overflow: "hidden",
  },
});

export default LoginScreen;
