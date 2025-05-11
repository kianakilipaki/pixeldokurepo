import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Audio } from "expo-av";
import { AppState } from "react-native";
import { usePlayerData } from "./playerDataContext";
import analytics from "@react-native-firebase/analytics";

const soundEffects = {
  error: require("../assets/sounds/error-8-206492.mp3"),
  success: require("../assets/sounds/open-new-level-143027.mp3"),
  hint: require("../assets/sounds/080245_sfx-magic-84935.mp3"),
};

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const { soundOn } = usePlayerData();
  const sound = useRef(null);
  const sfx = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  const playThemeMusic = async (theme) => {
    try {
      if (!soundOn) return;
      const themeMusic = theme?.bgSound;
      if (!themeMusic) return;

      // Unload previous sound if it exists
      if (sound.current) {
        console.log("[Pixeldokulogs] Unloading previous theme music");
        await sound.current.unloadAsync();
        sound.current = null;
      }

      const { sound: loadedSound } = await Audio.Sound.createAsync(themeMusic);
      sound.current = loadedSound;

      await loadedSound.setIsLoopingAsync(true);
      await loadedSound.setVolumeAsync(isMuted ? 0 : 0.8);
      await loadedSound.playAsync();

      console.log(`[Pixeldokulogs] Playing theme: ${theme?.themeKey}`);
    } catch (err) {
      console.error("[Pixeldokulogs] Error playing theme music:", err);
    }
  };

  const playSoundEffect = async (effect) => {
    try {
      if (!soundOn) return;
      if (AppState.currentState !== "active") {
        console.warn(`Skipped "${effect}" because app is not active`);
        return;
      }

      const sfxSound = sfx.current?.[effect];
      if (!sfxSound) return;

      await sfxSound.setPositionAsync(0); // reset to beginning
      await sfxSound.playAsync();
      console.log(`[Pixeldokulogs] Playing sound effect: ${effect}`);
    } catch (err) {
      console.error(
        `[Pixeldokulogs] Error playing "${effect}" sound effect:`,
        err
      );
    }
  };

  const stopMusic = async () => {
    if (sound.current) {
      await sound.current.unloadAsync();
      sound.current = null;
      console.log(`[Pixeldokulogs] Stopping music`);
    }
  };

  useEffect(() => {
    if (!soundOn) return;
    console.log("[Pixeldokulogs] Setting up audio context...");
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active" && sound.current && !isMuted) {
        console.log(`[Pixeldokulogs] Replaying music: ${sound.current._key}`);
        sound.current
          .playAsync()
          .catch((err) => console.warn("Playback error:", err));
      }
    });
    const loadSfx = async () => {
      const loaded = {};
      for (const key in soundEffects) {
        const { sound } = await Audio.Sound.createAsync(soundEffects[key]);
        loaded[key] = sound;
      }
      sfx.current = loaded;
    };

    loadSfx();

    return () => {
      subscription.remove();
      stopMusic();
      if (sfx.current) {
        Object.values(sfx.current).forEach((s) => s.unloadAsync());
      }
    };
  }, []);

  useEffect(() => {
    if (!soundOn) return;
    const setAudioMode = async () => {
      try {
        await Audio.setAudioModeAsync({
          interruptionModeIOS: isMuted ? 0 : 1, // 0: mix with others, 1: do not mix
          interruptionModeAndroid: isMuted ? 2 : 1, // 2: mix with others, 1: do not mix
          shouldDuckAndroid: !isMuted,
        });
      } catch (error) {
        console.error("[Pixeldokulogs] Error setting audio mode:", error);
      }
    };

    setAudioMode();
  }, [isMuted]);

  return (
    <MusicContext.Provider
      value={{
        playThemeMusic,
        playSoundEffect,
        muteMusic: async () => {
          if (sound.current) await sound.current.setVolumeAsync(0);
          setIsMuted(true);
          analytics().logEvent("music_muted", {
            music: sound.current?._key,
          });
          console.log(`[Pixeldokulogs] Mute music`);
        },
        unmuteMusic: async () => {
          if (sound.current) await sound.current.setVolumeAsync(0.8);
          setIsMuted(false);
          console.log(`[Pixeldokulogs] UnMute music`);
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
