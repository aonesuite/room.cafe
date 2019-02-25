export declare type ClarityType = "HD" | "SD" | "FHD";

// https://support.google.com/youtube/answer/6375112?co=GENIE.Platform%3DDesktop&hl=zh-Hans
export const clarities = {
  // 标清 480p
  "SD": {
    width: 854, height: 480, bitrate: 800, label: "480p (SD)"
  },

    // 超清 720p
  "HD": {
    width: 1280, height: 720, bitrate: 1200, label: "720p (HD)"
  },

    // 1080p
  "FHD": {
    width: 1920, height: 1080, bitrate: 1500, label: "1080p (FHD)"
  },
}

export function getClarity(clarity: ClarityType) {
  return clarities[clarity];
}