import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SudokuScreen from "../app/SudokuScreen";

// --- SETUP MOCKS --- //
const mockProgress = {
  board: [
    [0, 4, 8, 7, 0, 0, 6, 1, 9],
    [7, 0, 5, 9, 2, 6, 0, 8, 4],
    [3, 6, 9, 1, 0, 0, 2, 0, 5],
    [8, 0, 0, 4, 6, 5, 0, 9, 3],
    [5, 9, 0, 0, 7, 2, 0, 4, 0],
    [0, 0, 6, 0, 0, 0, 5, 2, 7],
    [9, 5, 3, 2, 0, 7, 4, 6, 8],
    [0, 0, 2, 0, 4, 8, 0, 3, 1],
    [0, 8, 4, 0, 3, 0, 0, 5, 0],
  ],
  difficulty: "Easy",
  errorCell: [],
  hints: 3,
  initialBoard: [
    [0, 4, 8, 7, 0, 0, 6, 1, 9],
    [7, 0, 5, 9, 2, 6, 0, 8, 4],
    [3, 6, 9, 1, 0, 0, 2, 0, 5],
    [8, 0, 0, 4, 6, 5, 0, 9, 3],
    [5, 9, 0, 0, 7, 2, 0, 4, 0],
    [0, 0, 6, 0, 0, 0, 5, 2, 7],
    [9, 5, 3, 2, 0, 7, 4, 6, 8],
    [0, 0, 2, 0, 4, 8, 0, 3, 1],
    [0, 8, 4, 0, 3, 0, 0, 5, 0],
  ],
  mistakeCounter: 3,
  solutionBoard: [
    [2, 4, 8, 7, 5, 3, 6, 1, 9],
    [7, 1, 5, 9, 2, 6, 3, 8, 4],
    [3, 6, 9, 1, 8, 4, 2, 7, 5],
    [8, 2, 7, 4, 6, 5, 1, 9, 3],
    [5, 9, 1, 3, 7, 2, 8, 4, 6],
    [4, 3, 6, 8, 9, 1, 5, 2, 7],
    [9, 5, 3, 2, 1, 7, 4, 6, 8],
    [6, 7, 2, 5, 4, 8, 9, 3, 1],
    [1, 8, 4, 6, 3, 9, 7, 5, 2],
  ],
  theme: {
    bgSound: 8,
    bgSource: 7,
    index: 0,
    locked: false,
    source: 6,
    themeKey: "birds",
    title: "BirdDoku",
  },
  timer: 0,
};

const mockNavigate = jest.fn();
const mockResetProgress = jest.fn(() => ({ mockProgress }));
const mockSetTheme = jest.fn();
const mockSetDifficulty = jest.fn();
const mockSetSelectedCell = jest.fn();
const mockStopMusic = jest.fn();

jest.mock("../utils/gameContext", () => ({
  useGame: jest.fn(() => ({
    theme: mockProgress.theme,
    setTheme: mockSetTheme,
    difficulty: mockProgress.difficulty,
    setDifficulty: mockSetDifficulty,
    resetProgress: mockResetProgress,
    setSelectedCell: mockSetSelectedCell,
    board: mockProgress.board,
    initialBoard: mockProgress.initialBoard,
    solutionBoard: mockProgress.solutionBoard,
  })),
}));

jest.mock("../utils/musicContext", () => ({
  useMusic: jest.fn(() => ({
    playSoundEffect: jest.fn(),
    playThemeMusic: jest.fn(),
    stopMusic: jest.fn(),
  })),
}));

jest.mock("../utils/highscoreContext", () => ({
  useHighScore: jest.fn(() => ({
    HighScore: {
      birds: { Easy: 120, Medium: 300, Hard: 600 },
      swamp: { Easy: 150, Medium: 400, Hard: 700 },
    },
    saveHighScore: jest.fn(),
  })),
}));

jest.mock("../utils/coinContext", () => ({
  useCoins: jest.fn(() => ({
    coins: 100,
    addCoins: jest.fn(),
  })),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(() => ({
    navigate: mockNavigate,
  })),
}));

// --- TESTS --- //
describe("SudokuScreen", () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockNavigate.mockClear();
    mockResetProgress.mockClear();
    mockSetTheme.mockClear();
    mockSetDifficulty.mockClear();
    mockSetSelectedCell.mockClear();
  });

  it("renders the SudokuScreen correctly and loads the game", async () => {
    const route = {
      params: {
        theme: mockProgress.theme,
        difficulty: mockProgress.difficulty,
        isNewGame: true,
      },
    };

    const { getByTestId } = render(
      <SudokuScreen route={route} navigation={mockNavigate} />
    );

    // Check loading state
    await waitFor(() => {
      expect(getByTestId("loading-indicator")).toBeTruthy();
    });
  });

  it("starts a new game when isNewGame is true", async () => {
    const route = {
      params: {
        theme: mockProgress.theme,
        difficulty: mockProgress.difficulty,
        isNewGame: true,
      },
    };

    render(<SudokuScreen route={route} navigation={mockNavigate} />);

    // Check that resetProgress is called
    await waitFor(() => {
      expect(mockResetProgress).toHaveBeenCalledWith(
        route.params.theme,
        route.params.difficulty,
        false
      );
    });
  });

  it("continues the previous game when isNewGame is false", async () => {
    const route = {
      params: {
        theme: mockProgress.theme,
        difficulty: mockProgress.difficulty,
        isNewGame: false,
      },
    };

    render(<SudokuScreen route={route} navigation={mockNavigate} />);

    // Check that the game continues
    await waitFor(() => {
      expect(mockResetProgress).not.toHaveBeenCalled();
    });
  });
});
