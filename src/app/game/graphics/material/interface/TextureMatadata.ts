import { Coordinates } from "../../../math/interface/Coordinates";
import { Dimensions } from "../../../math/interface/Dimensions";
import { TextureAIDs } from "../enum/TextureAIDs";

export interface TextureMatadata {
  aid: TextureAIDs;
  path: string;
  frameSize: Dimensions;
  maxFrameIndex: Coordinates;
}
