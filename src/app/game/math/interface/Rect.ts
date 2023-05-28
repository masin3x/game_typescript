import { Coordinates } from "./Coordinates";
import { Dimensions } from "./Dimensions";
import { Shape } from "./Shape";

export interface Rect extends Shape {
  coordinates: Coordinates;
  dimensions: Dimensions;
}
