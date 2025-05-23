import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useGoogleAuth } from "../utils/authContext";
import { usePlayerData } from "../utils/playerDataContext";
import ModalTemplate from "./ModalTemplate";
import { AntDesign } from "@expo/vector-icons";
import gameStyles from "../utils/gameStyles";
import * as AppleAuthentication from "expo-apple-authentication";
import { useEffect, useState } from "react";

const SettingsModal = ({ visible, onClose, navigation }) => {
  const { soundOn, toggleSound, deletePlayerData } = usePlayerData();
  const { user, login, logout, removeUser, appleLogin } = useGoogleAuth();
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);

  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setIsAppleAvailable);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      console.log("[Pixeldokulogs] Sign-in with Google.");
      await login();
      onClose();
    } catch (error) {
      console.error("[Pixeldokulogs] Sign-in error:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate("Login");
      onClose();
    } catch (error) {
      console.error("[Pixeldokulogs] Logout error:", error);
    }
  };

  const deleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            console.log("[Pixeldokulogs] Deleting account...");
            await removeUser();
            await deletePlayerData();
            navigation.navigate("Login");
            onClose();
          },
        },
      ]
    );
  };

  const modalBody = (
    <View style={styles.content}>
      <View style={styles.row}>
        <Text style={styles.label}>Sound</Text>
        <Switch
          value={soundOn}
          onValueChange={toggleSound}
          accessibilityLabel="Toggle sound"
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Signed-in as</Text>
        <Text style={styles.value}>
          {user
            ? user.displayName
              ? user.displayName
              : "Apple User"
            : "Guest"}
        </Text>
      </View>
      <Text style={styles.value}>
        {user
          ? ""
          : "With a guest account, your progress will not be saved if you delete the game."}
      </Text>
      <View style={styles.col}>
        {user ? (
          <>
            <TouchableOpacity onPress={deleteAccount}>
              <Text style={styles.deleteButton}>Delete Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              style={[
                styles.button,
                { backgroundColor: gameStyles.colors.black1 },
              ]}
            >
              <Text style={styles.logout}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
              <AntDesign
                name="google"
                size={20}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.googleText}>Sign in with Google</Text>
            </TouchableOpacity>
            {isAppleAvailable && (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={
                  AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                }
                buttonStyle={
                  AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                }
                cornerRadius={10}
                style={styles.appleButton}
                onPress={appleLogin}
              />
            )}
          </>
        )}
      </View>
    </View>
  );

  return (
    <ModalTemplate
      modalTitle="Settings"
      modalBody={modalBody}
      modalVisible={visible}
      setModalVisible={onClose}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    width: "100%",
    gap: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  col: {
    flexDirection: "column",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    fontSize: 14,
    fontStyle: "italic",
  },
  icon: {
    marginRight: 10,
  },
  googleText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: gameStyles.fonts.fontFamily,
  },
  appleButton: {
    margin: 10,
    width: "100%",
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
  },
  button: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: gameStyles.colors.blue,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
  },
  deleteButton: {
    marginBottom: 20,
    fontSize: 14,
    color: gameStyles.colors.red,
    textDecorationLine: "underline",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  logout: {
    color: gameStyles.colors.white,
    fontFamily: gameStyles.fonts.fontFamily,
    fontSize: gameStyles.fonts.regularFontSize,
  },
});

export default SettingsModal;
