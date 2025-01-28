import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Audio } from "expo-av";
import { AppState } from "react-native";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const sound = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  const playBackgroundMusic = async (musicFile) => {
    try {
      if (sound.current) {
        await sound.current.stopAsync();
        await sound.current.unloadAsync();
      }
      const { sound: soundObject } = await Audio.Sound.createAsync(musicFile, {
        shouldPlay: true,
        isLooping: true,
        volume: isMuted ? 0 : 1,
      });
      sound.current = soundObject;
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  };

  const muteMusic = async () => {
    if (sound.current) {
      await sound.current.setVolumeAsync(0); // Mute
      setIsMuted(true);
    }
  };

  const unmuteMusic = async () => {
    if (sound.current) {
      await sound.current.setVolumeAsync(1); // Unmute
      setIsMuted(false);
    }
  };

  const stopMusic = async () => {
    if (sound.current) {
      try {
        await sound.current.stopAsync(); // Stop playback
        await sound.current.unloadAsync(); // Release resources
        sound.current = null; // Reset the reference
      } catch (error) {
        console.error("Error stopping sound:", error);
      }
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active" && !isMuted) {
        sound.current?.playAsync();
      } else {
        sound.current?.pauseAsync();
      }
    });

    return () => subscription.remove();
  }, [isMuted]);

  useEffect(() => {
    return () => {
      if (sound.current) {
        sound.current.unloadAsync(); // Clean up the sound object
      }
    };
  }, []);

  return (
    <MusicContext.Provider
      value={{
        playBackgroundMusic,
        muteMusic,
        unmuteMusic,
        stopMusic,
        isMuted,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
