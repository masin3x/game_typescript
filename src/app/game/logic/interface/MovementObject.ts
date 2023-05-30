import { Coordinates } from "../../math/interface/Coordinates";
import { LogicObject } from "./LogicObject";
import { Rect } from "../../math/interface/Rect";

export interface MovementObject extends LogicObject {
  movement: Coordinates;
  actualPosition: () => Rect;
}
