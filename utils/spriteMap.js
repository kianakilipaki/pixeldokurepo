// map sprite position to numbers
export const spriteMap = {
    1: { top: 0, left: 0 },
    2: { top: 0, left: '-10vw' },
    3: { top: 0, left: '-20vw' },
    4: { top: '-10vw', left: 0 },
    5: { top: '-10vw', left: '-10vw' },
    6: { top: '-10vw', left: '-20vw' },
    7: { top: '-20vw', left: 0 },
    8: { top: '-20vw', left: '-10vw' },
    9: { top: '-20vw', left: '-20vw' },
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
export const themes = {
  'birds': {
    title: 'BirdDoku',
    source: require('../assets/themes/Winter-Birds.png'),
    bgSource: require('../assets/themes/MntForest-bg.png'),
    difficulty: {
      easy: 4,
      medium: 1,
      hard: 3
    },
    locked: false
  },
  'fish': {
    title: 'FishDoku',
    source: require('../assets/themes/coral-fish.png'),
    bgSource: require('../assets/themes/ocean-bg.png'),
    difficulty: {
      easy: 4,
      medium: 1,
      hard: 3
    },
    locked: false
  },
  'unknown1': {
    title: 'Coming Soon',
    bgSource: require('../assets/gradient.png'),
  },
  'unknown2': {
    title: 'Coming Soon',
    bgSource: require('../assets/gradient.png'),
  },
  'unknown3': {
    title: 'Coming Soon',
    bgSource: require('../assets/gradient.png'),
  },
  'unknown4': {
    title: 'Coming Soon',
    bgSource: require('../assets/gradient.png'),
  },
  'unknown5': {
    title: 'Coming Soon',
    bgSource: require('../assets/gradient.png'),
  },
}