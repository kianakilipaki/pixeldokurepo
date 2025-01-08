// assetsMap.js
import React from "react";
import { View, Text } from "react-native";
import { Dimensions } from "react-native";

import Birds from "../assets/themes/Winter-Birds.svg";

export const ASSETS = {
  birds: Birds,
};

const { width } = Dimensions.get("window");

// map sprite position to numbers
export const spriteMap = {
  1: { top: 0, left: 0 },
  2: { top: 0, left: -width * 0.1 },
  3: { top: 0, left: -width * 0.2 },
  4: { top: -width * 0.1, left: 0 },
  5: { top: -width * 0.1, left: -width * 0.1 },
  6: { top: -width * 0.1, left: -width * 0.2 },
  7: { top: -width * 0.2, left: 0 },
  8: { top: -width * 0.2, left: -width * 0.1 },
  9: { top: -width * 0.2, left: -width * 0.2 },
};

// map sprite position to numbers for input buttons
export const spriteMapLG = {
  1: { top: 0, left: 0 },
  2: { top: 0, left: -48 },
  3: { top: 0, left: -96 },
  4: { top: -48, left: 0 },
  5: { top: -48, left: -48 },
  6: { top: -48, left: -96 },
  7: { top: -96, left: 0 },
  8: { top: -96, left: -48 },
  9: { top: -96, left: -96 },
};

// sprite themes
export const defaultThemes = {
  birds: {
    title: "BirdDoku",
    srcName: "Winter-Birds",
    source: require("../assets/themes/Winter-Birds.png"),
    bgSource: require("../assets/themes/MntForest-bg.png"),
    locked: false,
  },
  fish: {
    title: "FishDoku",
    source: require("../assets/themes/coral-fish.png"),
    bgSource: require("../assets/themes/ocean-bg.png"),
    locked: true,
  },
  cats: {
    title: "CatDoku",
    source: require("../assets/themes/cats.png"),
    bgSource: require("../assets/themes/MntForest-bg.png"),
    locked: true,
  },
  unknown1: {
    title: "Coming Soon",
    bgSource: require("../assets/gradient.png"),
    locked: true,
  },
  unknown2: {
    title: "Coming Soon",
    bgSource: require("../assets/gradient.png"),
    locked: true,
  },
};

export const ThemeAsset = ({ name, size = 20, position = {} }) => {
  const SvgIcon = ASSETS[name];

  if (!SvgIcon) {
    return (
      <View>
        <Text>{name}</Text>
      </View>
    );
  }

  return (
    <View style={{ position: "absolute", ...position }}>
      <SvgIcon width={size} height={size} />
    </View>
  );
};
