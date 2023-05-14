import { Modes } from "../../enum/Modes";
import { Statuses } from "../../enum/Statuses";
import { Item } from "../../item/interface/Item";
import { Levels } from "../../level/enum/Levels";
import { Player } from "../../player/interface/Player";
import { PlayerState } from "../../player/interface/PlayerState";
import { Scene } from "../../scene/interface/Scene";

export interface State {
  mode: Modes;
  status: Statuses;
  scene: Scene;
  firstPlayer: Player;
  firstPlayerState: PlayerState;
  secondPlayer: Player | null;
  secondPlayerState: PlayerState | null;
  items: Map<string, Item>;
  timeSinceLastGenerate: number;
  level: Levels;
}
