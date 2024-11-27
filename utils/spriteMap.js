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
    2: { top: 0, left: -40 },
    3: { top: 0, left: -80 },
    4: { top: -40, left: 0 },
    5: { top: -40, left: -40 },
    6: { top: -40, left: -80 },
    7: { top: -80, left: 0 },
    8: { top: -80, left: -40 },
    9: { top: -80, left: -80 },
  };

// sprite themes
export const themes = {
  'birds': {
    source: require('../assets/Winter-Birds.png'),
    bgSource: require('../assets/sprite_northWindShrineBG.png')
  }
}