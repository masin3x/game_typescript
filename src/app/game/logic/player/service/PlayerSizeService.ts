import { Dimensions } from "../../../math/interface/Dimensions";
import { PlayerSizeLevels } from "../enum/PlayerSizeLevels";

export class PlayerSizeService {
  private static readonly defaultSize: Dimensions = { width: 70, height: 100 };

  private static readonly sizes: Map<PlayerSizeLevels, Dimensions> = new Map([
    [PlayerSizeLevels.LOW, { width: 40, height: 60 }],
    [PlayerSizeLevels.MEDIUM, PlayerSizeService.defaultSize],
    [PlayerSizeLevels.HIGH, { width: 100, height: 140 }],
  ]);

  static getAllSizes(): Map<PlayerSizeLevels, Dimensions> {
    return PlayerSizeService.sizes;
  }

  static getSize(playerSizeLevel: PlayerSizeLevels): Dimensions {
    return PlayerSizeService.sizes.get(playerSizeLevel) || PlayerSizeService.defaultSize;
  }
}
