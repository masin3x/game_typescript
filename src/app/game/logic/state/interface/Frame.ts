import { ItemFrame } from "../../item/interface/ItemFrame";
import { Levels } from "../../level/enum/Levels";
import { PlayerFrame } from "../../player/interface/PlayerFrame";

export interface Frame {
  readonly items?: ItemFrame;
  readonly firstPlayerFrame?: PlayerFrame;
  readonly secondPlayerFrame?: PlayerFrame;
  readonly level?: Levels;
}
