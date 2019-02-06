export declare type ClarityType = "Normal" | "HD" | "SD" | "FHD";

export const clarities = {
  // 标清 480p
  "Normal": {
    width: 854, height: 480, bitrate: 800
  },

    // 高清 540p
  "HD": {
    width: 960, height: 540, bitrate: 1000
  },

    // 超清 720p
  "SD": {
    width: 1280, height: 720, bitrate: 1200
  },

    // 1080p
  "FHD": {
    width: 1920, height: 1080, bitrate: 1500
  },
}

export function getClarity(clarity: ClarityType) {
  return clarities[clarity];
}