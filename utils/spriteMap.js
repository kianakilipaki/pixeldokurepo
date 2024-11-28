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
    source: require('../assets/Winter-Birds.png'),
    bgSource: require('../assets/sprite_northWindShrineBG.png')
  }
}