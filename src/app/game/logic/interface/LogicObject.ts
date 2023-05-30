import { Material } from "../../display/graphics/interface/Material";
import { Rect } from "../../math/interface/Rect";

export interface LogicObject {
  aid: string;
  position: Rect;
  material: Material;
}
