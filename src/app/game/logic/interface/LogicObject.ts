import { Rect } from "../../math/interface/Rect";
import { Material } from "../../graphics/material/interface/Material";

export interface LogicObject {
  aid: string;
  position: Rect;
  material: Material;
}
