import { PlayerSizeLevels } from "../enum/PlayerSizeLevels";
import { PlayerSpeedLevels } from "../enum/PlayerSpeedLevels";

export interface PlayerState {
  speed: PlayerSpeedLevels;
  size: PlayerSizeLevels;
  points: number;
  lifes: number;
  frameTextureKey?: string;
  isMoved: boolean;
  isChangedDirection: boolean;
  catchedCount: number;
  sizePowerUPCounter: number | null;
  speedPowerUPCounter: number | null;
}
