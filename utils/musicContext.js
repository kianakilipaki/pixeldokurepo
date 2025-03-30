import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Audio } from "expo-av";
import { AppState } from "react-native";
import { defaultThemes } from "./assetsMap";
import { useGame } from "./gameContext";

// Import sound effects
const soundEffects = {
  error: require("../assets/sounds/error-8-206492.mp3"),
  success: require("../assets/sounds/open-new-level-143027.mp3"),
  hint: require("../assets/sounds/080245_sfx-magic-84935.mp3"),
};

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const { theme } = useGame(); // Get theme from gameContext
  const sound = useRef(null);
  const soundAssets = useRef({}); // Store preloaded theme music
  const sfxAssets = useRef({}); // Store sound effects
  const [isMuted, setIsMuted] = useState(false);

  // Preload sound assets (theme music & sound effects)
  const loadSoundAssets = async () => {
    try {
      // Load theme sounds
      for (const key in defaultThemes) {
        const themeSound = defaultThemes[key].bgSound;

        if (!themeSound) continue; // Skip if no sound is defined

        const { sound } = await Audio.Sound.createAsync(themeSound, {
          volume: isMuted ? 0 : 0.8,
        });
        soundAssets.current[key] = sound;
      }

      // Load sound effects
      for (const key in soundEffects) {
        if (!soundEffects[key]) continue; // Skip if sound effect is missing

        const { sound } = await Audio.Sound.createAsync(soundEffects[key]);
        sfxAssets.current[key] = sound; // Correctly store the sound object
      }

      console.log(
        "Sound effects loaded successfully:",
        Object.keys(sfxAssets.current)
      );
    } catch (error) {
      console.error("Error loading sound assets:", error);
    }
  };

  // Play theme background music when theme changes
  const playThemeMusic = async () => {
    try {
      console.log("asset sound is: ", soundAssets.current[theme.themeKey]);

      if (!theme || !soundAssets.current[theme.themeKey]) return; // Ensure theme exists

      if (sound.current) {
        await sound.current.stopAsync();
        await sound.current.unloadAsync();
      }

      sound.current = soundAssets.current[theme.themeKey];
      await sound.current.setIsLoopingAsync(true);
      await sound.current.setVolumeAsync(isMuted ? 0 : 0.8);
      await sound.current.playAsync();
    } catch (error) {
      console.error("Error playing theme music:", error);
    }
  };

  // Stop currently playing music
  const stopMusic = async () => {
    if (sound.current) {
      try {
        await sound.current.stopAsync();
        await sound.current.unloadAsync();
        sound.current = null;
      } catch (error) {
        console.error("Error stopping music:", error);
      }
    }
  };

  // Play sound effect (mistake/success/hint)
  const playSoundEffect = async (effect) => {
    console.log("Attempting to play sound effect:", effect);

    const sfx = sfxAssets.current[effect]; // Correct reference

    if (sfx) {
      try {
        await sfx.setVolumeAsync(1);
        await sfx.replayAsync(); // Restart the sound effect
        console.log(`${effect} sound effect played successfully`);
      } catch (error) {
        console.error(`Error playing ${effect} sound effect:`, error);
      }
    } else {
      console.warn(`Sound effect "${effect}" not found in preloaded assets.`);
    }
  };

  // Automatically play the correct theme music when theme changes
  useEffect(() => {
    console.log("sound theme: ", theme);
    playThemeMusic();
  }, [theme]); // <- Runs whenever `theme` updates

  // Load sound assets on mount
  useEffect(() => {
    loadSoundAssets();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active" && !isMuted) {
        sound.current?.playAsync();
      } else {
        sound.current?.pauseAsync();
      }
    });

    return () => {
      subscription.remove();
      Object.values(soundAssets.current).forEach((s) => s.unloadAsync());
      Object.values(sfxAssets.current).forEach((s) => s.unloadAsync());
    };
  }, []);

  return (
    <MusicContext.Provider
      value={{
        playSoundEffect, // Function to play sound effects
        muteMusic: async () => {
          if (sound.current) await sound.current.setVolumeAsync(0);
          setIsMuted(true);
        },
        unmuteMusic: async () => {
          if (sound.current) await sound.current.setVolumeAsync(1);
          setIsMuted(false);
        },
        stopMusic,
        isMuted,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
