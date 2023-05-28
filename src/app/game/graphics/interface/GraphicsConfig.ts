import { GraphicsEngineTypes } from "../engine/enum/GraphicsEngineTypes";
import { Dimensions } from "../../math/interface/Dimensions";

export interface GraphicsConfig {
  readonly graphicsEngineType: GraphicsEngineTypes;
  readonly isDrawRect: boolean;
}
