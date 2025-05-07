import React from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { useGoogleAuth } from "../utils/auth";
import { usePlayerData } from "../utils/playerDataContext";
import ModalTemplate from "./ModalTemplate";
import { AntDesign } from "@expo/vector-icons";
import themeStyles from "../utils/themeStyles";

const SettingsModal = ({ visible, onClose, navigation }) => {
  const { soundOn, toggleSound } = usePlayerData();
  const { user, signOut, promptAsync } = useGoogleAuth();

  const logout = async () => {
    try {
      await signOut(navigation);
      onClose();
    } catch (error) {
      console.error("PixelDokuLogs: Logout error:", error);
    }
  };

  const login = async () => {
    try {
      await promptAsync();
      onClose();
    } catch (error) {
      console.error("PixelDokuLogs: Login error:", error);
    }
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
        <Text style={styles.value}>{user ? user.displayName : "Guest"}</Text>
      </View>
      <Text style={styles.value}>
        {user
          ? ""
          : "With a guest account, your progress will not be saved if you delete the game."}
      </Text>
      <View style={styles.row}>
        {user ? (
          <TouchableOpacity onPress={logout} style={styles.button}>
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={login}>
            <AntDesign
              name="google"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.googleText}>Sign in with Google</Text>
          </TouchableOpacity>
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
    fontFamily: themeStyles.fonts.fontFamily,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeStyles.colors.red,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
  },
  logout: {
    color: themeStyles.colors.white,
    fontFamily: themeStyles.fonts.fontFamily,
  },
});

export default SettingsModal;
