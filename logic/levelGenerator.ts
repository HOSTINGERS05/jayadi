import { LevelConfig } from "../types";

export const getLevelConfig = (level: number): LevelConfig => {
  const config: LevelConfig = {
    level,
    rows: 6,
    cols: 6,
    time: 120,
    elementsRange: [1, 10],
    features: {},
    description: "Start your journey!"
  };

  if (level <= 20) {
    // Basic Tier
    if (level <= 5) {
      config.rows = 6; config.cols = 6;
      config.time = 120;
      config.elementsRange = [1, 10];
      config.description = "Basic Elements (H-Ne)";
    } else if (level <= 10) {
      config.rows = 7; config.cols = 6; // 42 tiles
      config.time = 110;
      config.elementsRange = [1, 18];
      config.description = "Introduction to Period 3";
    } else if (level <= 15) {
      config.rows = 8; config.cols = 6; // 48
      config.time = 105;
      config.elementsRange = [1, 20];
      config.description = "Alkali & Alkaline Earth";
    } else {
      config.rows = 8; config.cols = 7; // 56
      config.time = 100;
      config.elementsRange = [19, 25];
      config.description = "Early Transition Metals";
    }
  } 
  else if (level <= 40) {
    // Medium Tier
    if (level <= 25) {
      config.rows = 9; config.cols = 6; // 54
      config.time = 95;
      config.elementsRange = [21, 30];
      config.description = "First Row Transition";
    } else if (level <= 30) {
      config.rows = 9; config.cols = 7; // 63 -> odd number issue? 
      // Onet requires even number of tiles. 9x7 = 63. We need even.
      // Let's make it 9x8 = 72 but with gaps logic or just even grid.
      config.rows = 8; config.cols = 8; 
      config.time = 90;
      config.elementsRange = [26, 30];
      config.description = "Iron Group (Fe-Zn)";
    } else if (level <= 35) {
      config.rows = 10; config.cols = 7; // 70
      config.time = 85;
      config.elementsRange = [31, 50];
      config.features.fog = true;
      config.description = "Fog Mode: Metalloids";
    } else {
      config.rows = 10; config.cols = 8; // 80
      config.time = 80;
      config.elementsRange = [47, 54];
      config.description = "Heavy Metals & Halogens";
    }
  }
  else if (level <= 60) {
    // Hard Tier
    if (level <= 45) {
      config.rows = 10; config.cols = 9; // 90
      config.time = 75;
      config.elementsRange = [51, 54];
      config.features.obstacles = true;
      config.description = "Obstacles & Iodine/Xenon";
    } else if (level <= 50) {
      config.rows = 10; config.cols = 9;
      config.time = 70;
      config.elementsRange = [78, 80];
      config.features.dark = true;
      config.description = "Dark Mode: Noble Metals";
    } else if (level <= 55) {
      config.rows = 10; config.cols = 10;
      config.time = 65;
      config.elementsRange = [82, 86];
      config.features.gravity = true;
      config.description = "Gravity Mode: Lead & Radon";
    } else {
      config.rows = 10; config.cols = 10;
      config.time = 60;
      config.elementsRange = [57, 62];
      config.features.mirror = true;
      config.description = "Mirror Mode: Lanthanides";
    }
  }
  else if (level <= 80) {
    // Very Hard
    config.rows = 11; config.cols = 10;
    if (level <= 65) {
      config.time = 55;
      config.elementsRange = [58, 65];
      config.description = "Rare Earths";
    } else if (level <= 70) {
      config.time = 50;
      config.elementsRange = [63, 70];
      config.features.fakeTiles = true;
      config.description = "Fake Tiles Detected";
    } else if (level <= 75) {
      config.time = 45;
      config.elementsRange = [67, 71];
      config.features.fog = true;
      config.features.obstacles = true;
      config.description = "Foggy Maze";
    } else {
      config.time = 40;
      config.elementsRange = [71, 95];
      config.description = "The Spiral (Complex)";
    }
  }
  else {
    // Extreme
    config.rows = 12; config.cols = 10; // 120 tiles
    config.features.shuffleInterval = 10; // Auto shuffle
    if (level <= 85) {
      config.time = 35;
      config.elementsRange = [90, 103];
      config.features.blink = true;
      config.description = "Blinking Actinides";
    } else if (level <= 90) {
      config.time = 30;
      config.elementsRange = [104, 108];
      config.description = "Super Heavy: Rutherfordium+";
    } else if (level <= 95) {
      config.time = 25;
      config.elementsRange = [109, 112];
      config.features.shuffleInterval = 10;
      config.description = "Chaos Shuffle";
    } else {
      // The Ultimate Levels
      config.rows = 12; config.cols = 12; // 144 max
      config.time = 25;
      config.elementsRange = [113, 118];
      config.features = {
        gravity: true,
        fog: true,
        blink: true,
        fakeTiles: true,
        shuffleInterval: 15
      };
      config.description = "FINAL EXAM: The Oganesson Challenge";
    }
  }

  // Safety check for grid size evenness (Onet must have even total tiles)
  if ((config.rows * config.cols) % 2 !== 0) {
    config.rows = config.rows;
    config.cols = config.cols + 1;
  }

  return config;
};
