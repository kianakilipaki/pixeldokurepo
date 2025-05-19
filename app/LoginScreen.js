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
import { useGoogleAuth } from "../utils/authContext";
import {
  migrateLocalGameData,
  resetAndSeedOldGameData,
} from "../utils/playerDataService";
import gameStyles from "../utils/gameStyles";
import LoadingIndicator from "../components/loadingIcon";
import { AntDesign } from "@expo/vector-icons";
import { usePlayerData } from "../utils/playerDataContext";
import { useEffect } from "react";

const LoginScreen = ({ navigation }) => {
  const { user, loading, login } = useGoogleAuth();
  const { loadPlayerData } = usePlayerData();

  useEffect(() => {
    if (user) {
      navigation.replace("Home");
    }
  }, [user]);

  const handleGuestLogin = async () => {
    Alert.alert(
      "Continue as Guest",
      "Your progress will not be saved if you delete the game. Are you sure you want to continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          style: "destructive",
          onPress: async () => {
            console.log("[Pixeldokulogs] Login as guest. Initializing data...");
            //await resetAndSeedOldGameData();
            await migrateLocalGameData();
            await loadPlayerData();
            navigation.replace("Home");
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ImageBackground
        source={require("../assets/themes/birds/MntForest-bg.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={gameStyles.colors.blue}
        />
        <LoadingIndicator />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/themes/birds/MntForest-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={gameStyles.colors.blue}
      />
      <View style={styles.container}>
        <Image source={require("../assets/icon-bg.png")} style={styles.logo} />
        <Text style={styles.header}>Welcome to</Text>
        <Text style={styles.title}>PixelDoku</Text>

        <TouchableOpacity style={styles.googleButton} onPress={login}>
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
    fontFamily: gameStyles.fonts.fontFamily,
    fontSize: 36,
    textAlign: "center",
    color: gameStyles.colors.black1,
  },
  title: {
    fontFamily: gameStyles.fonts.fontFamily,
    fontSize: 48,
    marginBottom: 20,
    color: gameStyles.colors.red,
    transform: [{ scaleY: 2 }],
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: gameStyles.colors.blue,
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
    fontFamily: gameStyles.fonts.fontFamily,
  },
  guestText: {
    marginTop: 20,
    fontSize: 14,
    color: gameStyles.colors.white,
    textDecorationLine: "underline",
    fontFamily: gameStyles.fonts.fontFamily,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    overflow: "hidden",
  },
});

export default LoginScreen;
