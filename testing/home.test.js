import { render, fireEvent } from "@testing-library/react-native";
import HomeScreen from "../app/HomeScreen";
import { useGame } from "../utils/gameContext";
import { useThemes } from "../utils/themeContext";
import { useTutorial } from "../utils/useTutorial";
import { useNavigation } from "@react-navigation/native";
import { act } from "react";

// --- SETUP MOCKS --- //
const mocktoggleExpansion = jest.fn();
const mockNavigate = jest.fn();
const mockLoadProgress = jest.fn();

// We need to prepare mocks BEFORE jest.mock
jest.mock("../utils/gameContext", () => ({
  useGame: jest.fn(),
}));

jest.mock("../utils/themeContext", () => ({
  useThemes: jest.fn(),
}));

jest.mock("../utils/useTutorial", () => ({
  useTutorial: jest.fn(),
}));

jest.mock("../utils/coinContext", () => ({
  useCoins: jest.fn(() => ({
    coins: 100,
  })),
}));

jest.mock("../utils/highscoreContext", () => ({
  useHighScore: jest.fn(() => ({
    HighScore: {
      birds: { Easy: 120, Medium: 300, Hard: 600 },
      swamp: { Easy: 150, Medium: 400, Hard: 700 },
    },
  })),
}));

jest.mock("../utils/themeAnimationHook", () => {
  return {
    __esModule: true,
    default: () => ({
      slideAnimation: { interpolate: jest.fn() },
      fadeAnimation: { interpolate: jest.fn() },
      isExpanded: false,
      toggleExpansion: mocktoggleExpansion, // use real test mock
    }),
  };
});

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: jest.fn(() => ({
      navigate: mockNavigate, // use real test mock
    })),
    useFocusEffect: jest.fn((callback) => callback()),
  };
});

// --- TESTS --- //
describe("HomeScreen", () => {
  beforeEach(() => {
    // Mock all your hooks fresh for every test
    useGame.mockReturnValue({
      loadProgress: mockLoadProgress,
    });

    mockLoadProgress.mockResolvedValue({
      difficulty: "Easy",
      theme: { title: "SwampDoku" },
    });

    useThemes.mockReturnValue({
      themes: {
        birds: { title: "BirdDoku" },
        swamp: { title: "SwampDoku" },
      },
    });

    useTutorial.mockReturnValue({
      showTutorial: false,
      completeTutorial: jest.fn(),
    });

    useNavigation.mockReturnValue({
      navigate: mockNavigate,
    });

    mocktoggleExpansion.mockClear();
    mockNavigate.mockClear();
    mockLoadProgress.mockClear();
  });

  it("renders HomeScreen correctly", async () => {
    const { getByText } = render(<HomeScreen />);
    await act(async () => {
      expect(getByText("Welcome to")).toBeTruthy();
    });
    await act(async () => {
      expect(getByText("PixelDoku")).toBeTruthy();
    });
  });

  it("loads saved progress and shows 'Continue'", async () => {
    const { findByText } = render(
      <HomeScreen navigation={{ navigate: mockNavigate }} />
    );

    await act(async () => {
      expect(mockLoadProgress).toHaveBeenCalled();
    });

    const continueButton = await findByText("Continue");

    await act(async () => {
      expect(continueButton).toBeTruthy();
    });

    fireEvent.press(continueButton);

    await act(async () => {
      expect(mockNavigate).toHaveBeenCalledWith("SudokuScreen", {
        theme: { title: "SwampDoku" },
        difficulty: "Easy",
        isNewGame: false,
      });
    });
  });

  it("toggles theme list when 'New Game' is pressed", async () => {
    const { getByText } = render(<HomeScreen />);

    const newGameButton = getByText("New Game");
    fireEvent.press(newGameButton);

    await act(async () => {
      expect(mocktoggleExpansion).toHaveBeenCalled();
    });
  });

  it("shows loading indicator if themes not loaded", async () => {
    useThemes.mockReturnValueOnce({ themes: null });
    const { getByTestId } = render(<HomeScreen />);

    await act(async () => {
      expect(getByTestId("loading-indicator")).toBeTruthy();
    });
  });
});
