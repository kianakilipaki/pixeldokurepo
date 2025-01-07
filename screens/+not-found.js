import { View, Text } from "react-native";
import React from "react";

const NotFound = () => {
  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not Found!" }} />
      <View style={styles.container}>
        <Link href="./">Go back to Home screen!</Link>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "gray",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NotFound;
