// Providers.js

import React from "react";
import { CoinProvider } from "./utils/coinContext";
import { GameProvider } from "./utils/gameContext";
import { HighScoreProvider } from "./utils/highscoreContext";
import { ThemeProvider } from "./utils/themeContext";
import { MusicProvider } from "./utils/musicContext";

// Wrap all your context providers here
const Providers = ({ children }) => (
  <ThemeProvider>
    <GameProvider>
      <MusicProvider>
        <HighScoreProvider>
          <CoinProvider>{children}</CoinProvider>
        </HighScoreProvider>
      </MusicProvider>
    </GameProvider>
  </ThemeProvider>
);

export default Providers;
