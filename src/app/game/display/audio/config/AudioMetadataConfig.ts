import { AudioAIDs } from "../enum/AudioAIDs";
import { AudioMetadata } from "../interface/AuidioMetadata";

export const audioMetadataConfig = new Map<AudioAIDs, AudioMetadata>([
  [
    AudioAIDs.STEP,
    {
      aid: AudioAIDs.STEP,
      path: "/audio/step.wav",
      isSingleInstance: true,
    },
  ],
  [
    AudioAIDs.PICKUP_POSITIVE,
    {
      aid: AudioAIDs.PICKUP_POSITIVE,
      path: "/audio/pickup_positive.wav",
      isSingleInstance: false,
    },
  ],
  [
    AudioAIDs.PICKUP_NEGATIVE,
    {
      aid: AudioAIDs.PICKUP_NEGATIVE,
      path: "/audio/pickup_negative.wav",
      isSingleInstance: false,
    },
  ],
  [
    AudioAIDs.PICKUP_POWERUP,
    {
      aid: AudioAIDs.PICKUP_POWERUP,
      path: "/audio/pickup_powerup.wav",
      isSingleInstance: false,
    },
  ],
  [
    AudioAIDs.PICKUP_LOSS,
    {
      aid: AudioAIDs.PICKUP_LOSS,
      path: "/audio/pickup_loss.wav",
      isSingleInstance: false,
    },
  ],
  [
    AudioAIDs.LEVEL_UP,
    {
      aid: AudioAIDs.LEVEL_UP,
      path: "/audio/level_up.wav",
      isSingleInstance: false,
    },
  ],
]);
