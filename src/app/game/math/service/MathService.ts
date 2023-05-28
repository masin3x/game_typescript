import { Coordinates } from "../interface/Coordinates";
import { Dimensions } from "../interface/Dimensions";
import { Rect } from "../interface/Rect";

export class MathService {
  round(value: number, precision: number = 0): number {
    if (precision > 0) {
      return Math.round(value * 10 * precision) / (10 * precision);
    } else {
      return Math.round(value);
    }
  }

  getAverageValue(value1: number, value2: number): number {
    return this.round((value1 + value2) / 2);
  }

  getRectCenterPoint(rect: Rect): Coordinates {
    return {
      x: this.getAverageValue(rect.coordinates.x, rect.dimensions.width),
      y: this.getAverageValue(rect.coordinates.y, rect.dimensions.height),
    };
  }

  createRectByCenterPoint(coordinates: Coordinates, dimensions: Dimensions): Rect {
    return {
      coordinates: {
        x: this.round(coordinates.x - dimensions.width / 2),
        y: this.round(coordinates.y - dimensions.height / 2),
      },
      dimensions: dimensions,
    };
  }

  createDimensionsByScale(dimensions: Dimensions, scale: number): Dimensions {
    return {
      width: this.round(dimensions.width * scale),
      height: this.round(dimensions.height * scale),
    };
  }

  generateRandom(min: number, max: number): number {
    const diff = max - min;

    return this.round(Math.random() * diff + min);
  }

  getIndexWithPossibility(possibilities: number[]): number {
    const random = this.generateRandom(0, 100);

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

  isRectIntersect(rect1: Rect, rect2: Rect): boolean {
    return !(
      rect2.coordinates.x > rect1.coordinates.x + rect1.dimensions.width ||
      rect1.coordinates.x > rect2.coordinates.x + rect2.dimensions.width ||
      rect2.coordinates.y > rect1.coordinates.y + rect1.dimensions.height ||
      rect1.coordinates.y > rect2.coordinates.y + rect2.dimensions.height
    );
  }
}
