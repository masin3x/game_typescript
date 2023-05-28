import { Coordinates } from "../../../math/interface/Coordinates";
import { Rect } from "../../../math/interface/Rect";
import { PlayerSizeLevels } from "../enum/PlayerSizeLevels";
import { PlayerSpeedLevels } from "../enum/PlayerSpeedLevels";

export interface PlayerFrame {
  aid: string;
  coordinates?: Coordinates;
  movement?: Coordinates;
  position?: Rect;
  actualPosition?: Rect;
  color?: string;
  speed?: PlayerSpeedLevels;
  size?: PlayerSizeLevels;
  points?: number;
  lifes?: number;
  frameTextureKey?: string;
  textureKey?: string;
}
