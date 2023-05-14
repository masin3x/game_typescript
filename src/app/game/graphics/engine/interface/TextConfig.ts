import { Coordinates } from "../../../math/interface/Coordinates";

export interface TextConfig {
  coordinates: Coordinates;
  font?: string;
  size?: number;
  color?: string;
  isBold?: boolean;
  centerRangeX?: { min: number; max: number };
  centerRangeY?: { min: number; max: number };
}
