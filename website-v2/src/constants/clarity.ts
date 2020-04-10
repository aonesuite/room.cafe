import { VideoEncoderConfigurationPreset } from "agora-rtc-sdk-ng"

export declare type ClarityType = "HD" | "SD" | "FHD"

export interface Clarity {
  label: string
  value: VideoEncoderConfigurationPreset
}

// https://support.google.com/youtube/answer/6375112?co=GENIE.Platform%3DDesktop&hl=zh-Hans
export const clarities: Clarity[] = [
  {
    label: "360p",
    value: "360p_11"
  },
  {
    label: "480p (SD)",
    value: "480p_9"
  },
  {
    label: "720p (HD)",
    value: "720p_3"
  },
  {
    label: "1080p (FHD)",
    value: "1080p_2"
  }
]
