// map sprite position to numbers
export const spriteMap = {
    1: { top: 0, left: 0 },
    2: { top: 0, left: -35 },
    3: { top: 0, left: -70 },
    4: { top: -35, left: 0 },
    5: { top: -35, left: -35 },
    6: { top: -35, left: -70 },
    7: { top: -70, left: 0 },
    8: { top: -70, left: -35 },
    9: { top: -70, left: -70 },
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
    bgSource: require('../assets/themes/sprite_northWindShrineBG.png'),
    difficulty: {
      easy: {loses: 3, wins: 4 },
      medium: {loses: 2, wins: 1 },
      hard: {loses: 3, wins: 3 }
    }
  },
  'fish': {
    title: 'FishDoku',
    source: require('../assets/themes/coral-fish.png'),
    bgSource: require('../assets/themes/ocean-bg.png'),
    difficulty: {
      easy: {loses: 3, wins: 4 },
      medium: {loses: 2, wins: 1 },
      hard: {loses: 3, wins: 3 }
    }
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