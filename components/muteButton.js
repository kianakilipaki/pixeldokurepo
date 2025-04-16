import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { useMusic } from "../utils/musicContext";
import themeStyles from "../utils/themeStyles";

const MusicToggleButton = () => {
  const { isMuted, muteMusic, unmuteMusic } = useMusic();

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
    >
      <Image
        source={isMuted ? mute : unmute}
        style={[themeStyles.icons.iconSizeSmall, { marginRight: 20 }]}
      />
    </TouchableOpacity>
  );
};

export default MusicToggleButton;
