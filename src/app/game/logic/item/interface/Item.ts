import { MovementObject } from "../../interface/MovementObject";
import { ItemSizeLevels } from "../enum/ItemSizeLevels";
import { ItemSpeedLevels } from "../enum/ItemSpeedLevels";
import { ItemTypes } from "../enum/ItemTypes";
import { ItemValueLevels } from "../enum/ItemValueLevels";

export interface Item extends MovementObject {
  type: ItemTypes;
  value: ItemValueLevels;
  isPositive: boolean;
  speed: ItemSpeedLevels;
  size: ItemSizeLevels;
}
