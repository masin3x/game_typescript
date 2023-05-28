import { ItemGenerationFrequencyLevels } from "../../item/enum/ItemGenerationFrequencyLevels";
import { ItemSpeedLevels } from "../../item/enum/ItemSpeedLevels";
import { ItemTypes } from "../../item/enum/ItemTypes";
import { ItemTypesPossibilityLevels } from "../../item/enum/ItemTypesPossibilityLevels";

export interface LevelRules {
  readonly itemsSpeed: ItemSpeedLevels;
  readonly itemGenerationFrequency: ItemGenerationFrequencyLevels;
  readonly itemTypesPossibility: Map<ItemTypes, ItemTypesPossibilityLevels>;
  readonly catchedLimit: number | null;
}
