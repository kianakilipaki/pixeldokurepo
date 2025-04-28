// This file is used to set up the testing environment for Jest.

// Mock react-native-gesture-handler
import "react-native-gesture-handler/jestSetup";

// Mock AsyncStorage
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
jest.mock("@react-native-async-storage/async-storage", () => ({
  ...mockAsyncStorage,
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock `react-native-google-mobile-ads` to avoid native module errors
jest.mock("react-native-google-mobile-ads", () => {
  return {
    __esModule: true,
    default: () => ({
      initialize: jest.fn(() => Promise.resolve()),
    }),
    RewardedAd: {
      createForAdRequest: jest.fn(() => ({
        addAdEventListener: jest.fn(),
        load: jest.fn(),
        show: jest.fn(),
      })),
    },
    RewardedAdEventType: {
      LOADED: "loaded",
      EARNED_REWARD: "earned_reward",
    },
  };
});

// Mock `react-native-iap`
jest.mock("react-native-iap", () => ({
  withIAPContext: (Component) => Component,
  initConnection: jest.fn(),
  getProducts: jest.fn(),
  getPurchaseHistory: jest.fn(),
  getAvailablePurchases: jest.fn(),
  purchase: jest.fn(),
  acknowledgePurchase: jest.fn(),
  requestSubscription: jest.fn(),
  finishTransaction: jest.fn(),
}));

// Mock 'expo-font' to avoid loading fonts in tests
jest.mock("expo-font", () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
}));
jest.mock("@expo-google-fonts/silkscreen", () => ({
  useSilkscreen_400Regular: () => [true, false],
  useSilkscreen_400Bold: () => [true, false],
}));

// Mock 'react-navigation/native' to avoid navigation errors in tests
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
      setParams: jest.fn(),
    }),
    useFocusEffect: jest.fn((callback) => callback()),
  };
});

// Mock 'expo-av' to avoid audio errors in tests
jest.mock("expo-av", () => {
  const soundMock = {
    setIsLoopingAsync: jest.fn(),
    setVolumeAsync: jest.fn(),
    playAsync: jest.fn(),
    unloadAsync: jest.fn(),
    setPositionAsync: jest.fn(),
  };

  return {
    Audio: {
      Sound: {
        createAsync: jest.fn(() =>
          Promise.resolve({ sound: { ...soundMock } })
        ),
      },
      setAudioModeAsync: jest.fn(() => Promise.resolve()),
    },
  };
});

// Silence noisy console.log or handle async logs
jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "warn").mockImplementation(() => {});
jest.mock("lodash/debounce", () => (fn) => fn);
