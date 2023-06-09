import { Container } from "../../../core/Container";
import { Coordinates } from "../../../math/interface/Coordinates";
import { MathService } from "../../../math/service/MathService";
import { ItemTypes } from "../enum/ItemTypes";
import { ItemValueLevels } from "../enum/ItemValueLevels";

export class ItemRulesService {
  private readonly mathService: MathService = Container.resolve(MathService);

  private readonly rules: Map<ItemTypes, Coordinates[]> = new Map([
    [
      ItemTypes.POSITIVE_POINTS,
      [
        { x: 0, y: 0 },
        { x: 4, y: 1 },
        { x: 4, y: 2 },
        { x: 0, y: 2 },
        { x: 1, y: 4 },
        { x: 1, y: 3 },
        { x: 2, y: 3 },
        { x: 2, y: 5 },
        { x: 4, y: 4 },
        { x: 5, y: 2 },
      ],
    ],
    [
      ItemTypes.NEGATIVE_POINTS,
      [
        { x: 2, y: 7 },
        { x: 5, y: 1 },
        { x: 1, y: 1 },
        { x: 7, y: 3 },
        { x: 6, y: 3 },
        { x: 0, y: 1 },
        { x: 4, y: 3 },
        { x: 3, y: 0 },
        { x: 7, y: 6 },
        { x: 6, y: 6 },
      ],
    ],
  ]);

  getItemsByType(type: ItemTypes): Coordinates[] {
    if (type === ItemTypes.HEALTH || type === ItemTypes.SPEED || type === ItemTypes.SIZE) {
      return this.rules.get(ItemTypes.POSITIVE_POINTS) || [];
    } else {
      return this.rules.get(type) || [];
    }
  }

  getItemByTypeAndIndex(type: ItemTypes, index: number): Coordinates {
    const items = this.getItemsByType(type);

    return items[index];
  }

  getItemValueByIndex(index: number) {
    const value = index % 3;

    if (value === 0) {
      return ItemValueLevels.LOW;
    } else if (value === 1) {
      return ItemValueLevels.MEDIUM;
    } else {
      return ItemValueLevels.HIGH;
    }
  }

  getItemColorByType(type: ItemTypes): string {
    if (type === ItemTypes.HEALTH) {
      return "#bc0000";
    } else if (type === ItemTypes.SPEED) {
      return "#096900";
    } else if (type === ItemTypes.SIZE) {
      return "#8300ff";
    } else {
      return "#ffffff";
    }
  }

  getIsPositiveByType(type: ItemTypes): boolean {
    if (type === ItemTypes.HEALTH) {
      return true;
    } else if (type === ItemTypes.SPEED) {
      return this.mathService.generateRandom(0, 1) === 0;
    } else if (type === ItemTypes.SIZE) {
      return this.mathService.generateRandom(0, 1) === 0;
    } else if (type === ItemTypes.POSITIVE_POINTS) {
      return true;
    } else if (type === ItemTypes.NEGATIVE_POINTS) {
      return false;
    } else {
      return true;
    }
  }
}
