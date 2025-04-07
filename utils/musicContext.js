import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Audio } from "expo-av";
import { AppState } from "react-native";

const soundEffects = {
  error: require("../assets/sounds/error-8-206492.mp3"),
  success: require("../assets/sounds/open-new-level-143027.mp3"),
  hint: require("../assets/sounds/080245_sfx-magic-84935.mp3"),
};

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const sound = useRef(null);
  const sfx = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  const playThemeMusic = async (theme) => {
    try {
      const themeMusic = theme?.bgSound;
      if (!themeMusic) return;

      // Unload previous sound if it exists
      if (sound.current) {
        console.log("Unloading previous theme music");
        await sound.current.unloadAsync();
        sound.current = null;
      }

      const { sound: loadedSound } = await Audio.Sound.createAsync(themeMusic);
      sound.current = loadedSound;

      await loadedSound.setIsLoopingAsync(true);
      await loadedSound.setVolumeAsync(isMuted ? 0 : 0.8);
      await loadedSound.playAsync();

      console.log(`Playing theme: ${theme?.themeKey}`);
    } catch (err) {
      console.error("Error playing theme music:", err);
    }
  };

  const playSoundEffect = async (effect) => {
    try {
      const sfxSound = sfx.current?.[effect];
      if (!sfxSound) return;
      await sfxSound.setPositionAsync(0); // reset to beginning
      await sfxSound.playAsync();
      console.log(`Playing sound effect: ${effect}`);
    } catch (err) {
      console.error(`Error playing "${effect}" sound effect:`, err);
    }
  };

  const stopMusic = async () => {
    if (sound.current) {
      await sound.current.unloadAsync();
      sound.current = null;
      console.log(`Stopping music`);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active" && sound.current && !isMuted) {
        console.log(`Replaying music: ${sound.current}`);
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
      console.log(`Loaded sound effects: ${Object.keys(loaded).join(", ")}`);
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

  return (
    <MusicContext.Provider
      value={{
        playThemeMusic,
        playSoundEffect,
        muteMusic: async () => {
          if (sound.current) await sound.current.setVolumeAsync(0);
          setIsMuted(true);
          console.log(`Mute music`);
        },
        unmuteMusic: async () => {
          if (sound.current) await sound.current.setVolumeAsync(0.8);
          setIsMuted(false);
          console.log(`UnMute music`);
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
