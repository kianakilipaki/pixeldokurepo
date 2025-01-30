import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TUTORIAL_KEY = "sudokuTutorialSeen";

export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const checkTutorialStatus = async () => {
      const seen = await AsyncStorage.getItem(TUTORIAL_KEY);
      if (!seen) {
        setShowTutorial(true);
      }
    };

    checkTutorialStatus();
  }, []);

  const completeTutorial = async () => {
    await AsyncStorage.setItem(TUTORIAL_KEY, "true");
    setShowTutorial(false);
  };

  return { showTutorial, completeTutorial };
}
