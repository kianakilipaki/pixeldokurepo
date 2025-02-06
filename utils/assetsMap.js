// assetsMap.js
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const isTablet = width > 765;
export const cellSize = isTablet ? (width * 0.085) / 1.1 : width * 0.085;

// map sprite position to numbers
export const spriteMap = {
  1: { top: 0, left: 0 },
  2: { top: 0, left: -cellSize },
  3: { top: 0, left: -cellSize * 2 },
  4: { top: -cellSize, left: 0 },
  5: { top: -cellSize, left: -cellSize },
  6: { top: -cellSize, left: -cellSize * 2 },
  7: { top: -cellSize * 2, left: 0 },
  8: { top: -cellSize * 2, left: -cellSize },
  9: { top: -cellSize * 2, left: -cellSize * 2 },
};

export const cellSizeLG = isTablet ? width * 0.07 : width * 0.14;

// map sprite position to numbers for input buttons
export const spriteMapLG = {
  1: { top: 0, left: 0 },
  2: { top: 0, left: -cellSizeLG },
  3: { top: 0, left: -cellSizeLG * 2 },
  4: { top: -cellSizeLG, left: 0 },
  5: { top: -cellSizeLG, left: -cellSizeLG },
  6: { top: -cellSizeLG, left: -cellSizeLG * 2 },
  7: { top: -cellSizeLG * 2, left: 0 },
  8: { top: -cellSizeLG * 2, left: -cellSizeLG },
  9: { top: -cellSizeLG * 2, left: -cellSizeLG * 2 },
};

// sprite themes
export const defaultThemes = {
  birds: {
    title: "BirdDoku",
    srcName: "Winter-Birds",
    source: require("../assets/themes/Winter-Birds.png"),
    bgSource: require("../assets/themes/MntForest-bg.png"),
    bgSound: require("../assets/themes/forest-guitar-lofi-161108.mp3"),
    locked: false,
  },
  fish: {
    title: "FishDoku",
    source: require("../assets/themes/coral-fish.png"),
    bgSource: require("../assets/themes/ocean-bg.png"),
    bgSound: require("../assets/themes/waves-of-solitude-lofi-beats-281203.mp3"),
    locked: true,
  },
  cats: {
    title: "CatDoku",
    source: require("../assets/themes/cats.png"),
    bgSource: require("../assets/themes/cat-city.png"),
    bgSound: require("../assets/themes/lofi-song-memories-sunbeam-by-lofium-242711.mp3"),
    locked: true,
  },
  dogs: {
    title: "DogDoku",
    source: require("../assets/themes/dogs.png"),
    bgSource: require("../assets/themes/dog-park.png"),
    bgSound: require("../assets/themes/good-morning-upbeat-happy-ukulele-244395.mp3"),
    locked: true,
  },
  bugs: {
    title: "BugDoku",
    source: require("../assets/themes/bugs.png"),
    bgSource: require("../assets/themes/leaf-bg.png"),
    bgSound: require("../assets/themes/whispering-vinyl-loops-lofi-beats-281193.mp3"),
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
