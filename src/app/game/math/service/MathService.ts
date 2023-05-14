import { Coordinates } from "../interface/Coordinates";
import { Dimensions } from "../interface/Dimensions";
import { Rect } from "../interface/Rect";

export class MathService {
  static round(value: number, precision: number = 0): number {
    if (precision > 0) {
      return Math.round(value * 10 * precision) / (10 * precision);
    } else {
      return Math.round(value);
    }
  }

  static getAverageValue(value1: number, value2: number): number {
    return MathService.round((value1 + value2) / 2);
  }

  static getRectCenterPoint(rect: Rect): Coordinates {
    return {
      x: MathService.getAverageValue(rect.coordinates.x, rect.dimensions.width),
      y: MathService.getAverageValue(rect.coordinates.y, rect.dimensions.height),
    };
  }

  static createRectByCenterPoint(coordinates: Coordinates, dimensions: Dimensions): Rect {
    return {
      coordinates: {
        x: MathService.round(coordinates.x - dimensions.width / 2),
        y: MathService.round(coordinates.y - dimensions.height / 2),
      },
      dimensions: dimensions,
    };
  }

  static createDimensionsByScale(dimensions: Dimensions, scale: number): Dimensions {
    return {
      width: MathService.round(dimensions.width * scale),
      height: MathService.round(dimensions.height * scale),
    };
  }

  static generateRandom(min: number, max: number): number {
    const diff = max - min;

    return MathService.round(Math.random() * diff + min);
  }

  static getIndexWithPossibility(possibilities: number[]): number {
    const random = MathService.generateRandom(0, 100);
    const possibilitiesMap = new Map<number, { min: number; max: number }>();

    let i = 0;
    let findIndex = 0;

    for (let j = 0; j < possibilities.length; j++) {
      const possibility = possibilities[j];

      i++;
      const min = i;
      i += possibility - 1;

      if (random >= min && random <= i) {
        findIndex = j;
        break;
      }
    }

    return findIndex;
  }

  static isRectIntersect(rect1: Rect, rect2: Rect): boolean {
    return !(
      rect2.coordinates.x > rect1.coordinates.x + rect1.dimensions.width ||
      rect1.coordinates.x > rect2.coordinates.x + rect2.dimensions.width ||
      rect2.coordinates.y > rect1.coordinates.y + rect1.dimensions.height ||
      rect1.coordinates.y > rect2.coordinates.y + rect2.dimensions.height
    );
  }
}
