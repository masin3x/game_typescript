import { ItemGenerationFrequencyLevels } from "../../item/enum/ItemGenerationFrequencyLevels";
import { ItemSpeedLevels } from "../../item/enum/ItemSpeedLevels";
import { ItemTypes } from "../../item/enum/ItemTypes";
import { ItemTypesPossibilityLevels } from "../../item/enum/ItemTypesPossibilityLevels";
import { Levels } from "../enum/Levels";
import { LevelRules } from "../interface/LevelRules";

export class LevelRulesSerice {
  private static readonly rules: Map<Levels, LevelRules> = new Map([
    [
      Levels.ONE,
      {
        itemsSpeed: ItemSpeedLevels.VERY_LOW,
        catchedLimit: 3,
        itemGenerationFrequency: ItemGenerationFrequencyLevels.VERY_LOW,
        itemTypesPossibility: new Map([
          [ItemTypes.POSITIVE_POINTS, ItemTypesPossibilityLevels.HUNDRED],
          [ItemTypes.NEGATIVE_POINTS, ItemTypesPossibilityLevels.ZERO],
          [ItemTypes.SPEED, ItemTypesPossibilityLevels.ZERO],
          [ItemTypes.SIZE, ItemTypesPossibilityLevels.ZERO],
          [ItemTypes.HEALTH, ItemTypesPossibilityLevels.ZERO],
        ]),
      },
    ],
    [
      Levels.TWO,
      {
        itemsSpeed: ItemSpeedLevels.LOW,
        catchedLimit: 8,
        itemGenerationFrequency: ItemGenerationFrequencyLevels.LOW,
        itemTypesPossibility: new Map([
          [ItemTypes.POSITIVE_POINTS, ItemTypesPossibilityLevels.SIXTY_FIVE],
          [ItemTypes.NEGATIVE_POINTS, ItemTypesPossibilityLevels.ZERO],
          [ItemTypes.SPEED, ItemTypesPossibilityLevels.FIVTEN],
          [ItemTypes.SIZE, ItemTypesPossibilityLevels.FIVTEN],
          [ItemTypes.HEALTH, ItemTypesPossibilityLevels.FIVE],
        ]),
      },
    ],
    [
      Levels.THREE,
      {
        itemsSpeed: ItemSpeedLevels.LOW,
        catchedLimit: 15,
        itemGenerationFrequency: ItemGenerationFrequencyLevels.LOW,
        itemTypesPossibility: new Map([
          [ItemTypes.POSITIVE_POINTS, ItemTypesPossibilityLevels.FORTY_FIVE],
          [ItemTypes.NEGATIVE_POINTS, ItemTypesPossibilityLevels.TWENTY],
          [ItemTypes.SPEED, ItemTypesPossibilityLevels.FIVTEN],
          [ItemTypes.SIZE, ItemTypesPossibilityLevels.FIVTEN],
          [ItemTypes.HEALTH, ItemTypesPossibilityLevels.FIVE],
        ]),
      },
    ],
    [
      Levels.FOUR,
      {
        itemsSpeed: ItemSpeedLevels.MEDIUM,
        catchedLimit: 25,
        itemGenerationFrequency: ItemGenerationFrequencyLevels.MEDIUM,
        itemTypesPossibility: new Map([
          [ItemTypes.POSITIVE_POINTS, ItemTypesPossibilityLevels.FORTY],
          [ItemTypes.NEGATIVE_POINTS, ItemTypesPossibilityLevels.TWENTY_FIVE],
          [ItemTypes.SPEED, ItemTypesPossibilityLevels.FIVTEN],
          [ItemTypes.SIZE, ItemTypesPossibilityLevels.FIVTEN],
          [ItemTypes.HEALTH, ItemTypesPossibilityLevels.FIVE],
        ]),
      },
    ],
    [
      Levels.FIVE,
      {
        itemsSpeed: ItemSpeedLevels.MEDIUM,
        catchedLimit: 35,
        itemGenerationFrequency: ItemGenerationFrequencyLevels.HIGH,
        itemTypesPossibility: new Map([
          [ItemTypes.POSITIVE_POINTS, ItemTypesPossibilityLevels.THIRTY_FIVE],
          [ItemTypes.NEGATIVE_POINTS, ItemTypesPossibilityLevels.THIRTY],
          [ItemTypes.SPEED, ItemTypesPossibilityLevels.FIVTEN],
          [ItemTypes.SIZE, ItemTypesPossibilityLevels.FIVTEN],
          [ItemTypes.HEALTH, ItemTypesPossibilityLevels.FIVE],
        ]),
      },
    ],
    [
      Levels.SIX,
      {
        itemsSpeed: ItemSpeedLevels.MEDIUM,
        catchedLimit: 45,
        itemGenerationFrequency: ItemGenerationFrequencyLevels.VERY_HIGH,
        itemTypesPossibility: new Map([
          [ItemTypes.POSITIVE_POINTS, ItemTypesPossibilityLevels.FORTY],
          [ItemTypes.NEGATIVE_POINTS, ItemTypesPossibilityLevels.THIRTY_FIVE],
          [ItemTypes.SPEED, ItemTypesPossibilityLevels.TEN],
          [ItemTypes.SIZE, ItemTypesPossibilityLevels.TEN],
          [ItemTypes.HEALTH, ItemTypesPossibilityLevels.FIVE],
        ]),
      },
    ],
    [
      Levels.SEVEN,
      {
        itemsSpeed: ItemSpeedLevels.MEDIUM,
        catchedLimit: 55,
        itemGenerationFrequency: ItemGenerationFrequencyLevels.ULTRA,
        itemTypesPossibility: new Map([
          [ItemTypes.POSITIVE_POINTS, ItemTypesPossibilityLevels.FORTY],
          [ItemTypes.NEGATIVE_POINTS, ItemTypesPossibilityLevels.THIRTY_FIVE],
          [ItemTypes.SPEED, ItemTypesPossibilityLevels.TEN],
          [ItemTypes.SIZE, ItemTypesPossibilityLevels.TEN],
          [ItemTypes.HEALTH, ItemTypesPossibilityLevels.FIVE],
        ]),
      },
    ],
    [
      Levels.EIGHT,
      {
        itemsSpeed: ItemSpeedLevels.MEDIUM,
        catchedLimit: 60,
        itemGenerationFrequency: ItemGenerationFrequencyLevels.VERY_HIGH,
        itemTypesPossibility: new Map([
          [ItemTypes.POSITIVE_POINTS, ItemTypesPossibilityLevels.TWENTY],
          [ItemTypes.NEGATIVE_POINTS, ItemTypesPossibilityLevels.EIGHTY],
          [ItemTypes.SPEED, ItemTypesPossibilityLevels.ZERO],
          [ItemTypes.SIZE, ItemTypesPossibilityLevels.ZERO],
          [ItemTypes.HEALTH, ItemTypesPossibilityLevels.ZERO],
        ]),
      },
    ],
    [
      Levels.NINE,
      {
        itemsSpeed: ItemSpeedLevels.MEDIUM,
        catchedLimit: 63,
        itemGenerationFrequency: ItemGenerationFrequencyLevels.MEDIUM,
        itemTypesPossibility: new Map([
          [ItemTypes.POSITIVE_POINTS, ItemTypesPossibilityLevels.ZERO],
          [ItemTypes.NEGATIVE_POINTS, ItemTypesPossibilityLevels.ZERO],
          [ItemTypes.SPEED, ItemTypesPossibilityLevels.ZERO],
          [ItemTypes.SIZE, ItemTypesPossibilityLevels.ZERO],
          [ItemTypes.HEALTH, ItemTypesPossibilityLevels.HUNDRED],
        ]),
      },
    ],
    [
      Levels.TEN,
      {
        itemsSpeed: ItemSpeedLevels.VERY_HIGH,
        catchedLimit: 75,
        itemGenerationFrequency: ItemGenerationFrequencyLevels.ULTRA,
        itemTypesPossibility: new Map([
          [ItemTypes.POSITIVE_POINTS, ItemTypesPossibilityLevels.FORTY],
          [ItemTypes.NEGATIVE_POINTS, ItemTypesPossibilityLevels.FORTY],
          [ItemTypes.SPEED, ItemTypesPossibilityLevels.TEN],
          [ItemTypes.SIZE, ItemTypesPossibilityLevels.TEN],
          [ItemTypes.HEALTH, ItemTypesPossibilityLevels.ZERO],
        ]),
      },
    ],
    [
      Levels.ELEVEN,
      {
        itemsSpeed: ItemSpeedLevels.VERY_HIGH,
        catchedLimit: 90,
        itemGenerationFrequency: ItemGenerationFrequencyLevels.NIGHTMARE,
        itemTypesPossibility: new Map([
          [ItemTypes.POSITIVE_POINTS, ItemTypesPossibilityLevels.FORTY],
          [ItemTypes.NEGATIVE_POINTS, ItemTypesPossibilityLevels.FORTY],
          [ItemTypes.SPEED, ItemTypesPossibilityLevels.TEN],
          [ItemTypes.SIZE, ItemTypesPossibilityLevels.TEN],
          [ItemTypes.HEALTH, ItemTypesPossibilityLevels.ZERO],
        ]),
      },
    ],
    [
      Levels.TWELVE,
      {
        itemsSpeed: ItemSpeedLevels.ULTRA,
        catchedLimit: 105,
        itemGenerationFrequency: ItemGenerationFrequencyLevels.NIGHTMARE,
        itemTypesPossibility: new Map([
          [ItemTypes.POSITIVE_POINTS, ItemTypesPossibilityLevels.FORTY],
          [ItemTypes.NEGATIVE_POINTS, ItemTypesPossibilityLevels.FORTY],
          [ItemTypes.SPEED, ItemTypesPossibilityLevels.TEN],
          [ItemTypes.SIZE, ItemTypesPossibilityLevels.TEN],
          [ItemTypes.HEALTH, ItemTypesPossibilityLevels.ZERO],
        ]),
      },
    ],
    [
      Levels.THIRTEEN,
      {
        itemsSpeed: ItemSpeedLevels.ULTRA,
        catchedLimit: null,
        itemGenerationFrequency: ItemGenerationFrequencyLevels.NIGHTMARE_ULTRA,
        itemTypesPossibility: new Map([
          [ItemTypes.POSITIVE_POINTS, ItemTypesPossibilityLevels.FORTY],
          [ItemTypes.NEGATIVE_POINTS, ItemTypesPossibilityLevels.SIXTY],
          [ItemTypes.SPEED, ItemTypesPossibilityLevels.ZERO],
          [ItemTypes.SIZE, ItemTypesPossibilityLevels.ZERO],
          [ItemTypes.HEALTH, ItemTypesPossibilityLevels.ZERO],
        ]),
      },
    ],
  ]);

  static getAllRules(): Map<Levels, LevelRules> {
    return LevelRulesSerice.rules;
  }

  static getRulesByLevel(levels: Levels): LevelRules | null {
    return LevelRulesSerice.rules.get(levels) || null;
  }
}
