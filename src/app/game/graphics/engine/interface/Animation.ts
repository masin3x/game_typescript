import { LinearFunction } from "../../../math/interface/LinearFunction";

export interface Animation {
  movmentFunction?: LinearFunction;
  timeDuration: number;
  currentTime: number;
  sizeScalar?: number;
}
