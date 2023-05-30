import { AudioAIDs } from "../enum/AudioAIDs";

export interface AudioMetadata {
  aid: AudioAIDs;
  path: string;
  isSingleInstance: boolean;
}
