import { Coordinates } from "../../../math/interface/Coordinates";
import { TextureAIDs } from "../enum/TextureAIDs";

export interface TextureFrame {
  aid: TextureAIDs;
  frame?: Coordinates;
  frames?: Map<string, Coordinates[]>;
  animationSpeed?: number;
}
