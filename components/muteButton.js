import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { useMusic } from "../utils/musicContext";
import gameStyles from "../utils/gameStyles";
import { usePlayerData } from "../utils/playerDataContext";

const MusicToggleButton = () => {
  const { isMuted, muteMusic, unmuteMusic } = useMusic();
  const { soundOn } = usePlayerData();

  const handleToggle = () => {
    if (isMuted) {
      unmuteMusic();
    } else {
      muteMusic();
    }
  };

  const unmute = require("../assets/icons/mute.png");
  const mute = require("../assets/icons/unmute.png");
  return (
    <TouchableOpacity
      accessibilityLabel={isMuted ? "mute" : "unmute"}
      accessibilityRole="button"
      onPress={handleToggle}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      disabled={!soundOn}
    >
      <Image
        source={isMuted ? mute : unmute}
        style={[
          gameStyles.icons.iconSizeSmall,
          { marginRight: 20, opacity: soundOn ? 1 : 0.3 },
        ]}
      />
    </TouchableOpacity>
  );
};

export default MusicToggleButton;
