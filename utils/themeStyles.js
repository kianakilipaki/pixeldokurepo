import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const isTablet = width > 765;

// theme.js
const themeStyles = {
  colors: {
    black1: "#000",
    white: "#e5e5e5",
    gray: "#9b9b9b",
    gray1: "#d8d8d892",
    gray2: "#989797b0",
    gray3: "#747373a7",
    highlight1: "#ff8800ad",
    highlight2: "#FF88003F",
    highlight3: "#663600ad",
    gold: "#eec027",
    red: "#b80d0d",
    blue: "#1986e0",
  },
  fonts: {
    fontFamily: "Silkscreen-Regular",
    regularFontSize: isTablet ? 20 : 16,
    largeFontSize: isTablet ? 24 : 20,
    headerFontSize: isTablet ? 28 : 24,
  },
  icons: {
    iconSizeSmall: isTablet
      ? { width: 24, height: 24 }
      : { width: 16, height: 16 },
    iconSizeMedium: isTablet
      ? { width: 30, height: 30 }
      : { width: 20, height: 20 },
    iconSizeLarge: isTablet
      ? { width: 40, height: 40 }
      : { width: 30, height: 30 },
  },
  buttons: {
    button: {
      flex: 1,
      margin: 5,
      height: 48,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#1986e0",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 5,
    },
    buttonText: {
      fontFamily: "Silkscreen-Regular",
      fontSize: isTablet ? 20 : 16,
      color: "#fff",
    },
  },
};

export default themeStyles;
