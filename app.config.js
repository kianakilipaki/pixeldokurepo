// app.config.js

export default ({ config }) => {
  const isDev = process.env.EAS_BUILD_PROFILE === "development";

  return {
    ...config,
    runtimeVersion: isDev ? "1.0.0" : { policy: "appVersion" },
    expo: {
      ...config.expo,
      platforms: ["ios", "android"],
      name: "pixeldoku",
      slug: "pixeldoku",
      version: "6.1.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "light",
      newArchEnabled: true,
      splash: {
        image: "./assets/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#1986e0",
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/splash-icon.png",
          backgroundColor: "#ffffff",
        },
        package: "com.alanilyon.pixeldoku",
        permissions: ["com.android.vending.BILLING"],
        googleServicesFile: "./google-services.json",
      },
      ios: {
        bundleIdentifier: "com.alanilyon.pixeldoku",
        buildNumber: "1.0.0", // Match your versioning scheme
        supportsTablet: true,
        googleServicesFile: "./GoogleService-Info.plist",
        usesAppleSignIn: true,
        infoPlist: {
          NSAppTransportSecurity: {
            NSAllowsArbitraryLoads: true,
          },
        },
        config: {
          usesNonExemptEncryption: false,
        },
      },
      assetBundlePatterns: ["**/*"],
      plugins: [
        "expo-asset",
        "expo-build-properties",
        [
          "react-native-google-mobile-ads",
          {
            androidAppId: "ca-app-pub-6358927901907597~4329186260",
            iosAppId: "ca-app-pub-6358927901907597~5583801458",
          },
        ],
        "react-native-iap",
      ],
      extra: {
        eas: {
          projectId: "a9206d7c-7666-4f76-9f46-b9146ed68f8d",
        },
      },
      updates: {
        url: "https://u.expo.dev/a9206d7c-7666-4f76-9f46-b9146ed68f8d",
      },
    },
  };
};
