import { Dimensions } from "../../../math/interface/Dimensions";
import { PlayerSizeLevels } from "../enum/PlayerSizeLevels";

export class PlayerSizeService {
  private readonly defaultSize: Dimensions = { width: 70, height: 100 };

  private readonly sizes: Map<PlayerSizeLevels, Dimensions> = new Map([
    [PlayerSizeLevels.LOW, { width: 40, height: 60 }],
    [PlayerSizeLevels.MEDIUM, this.defaultSize],
    [PlayerSizeLevels.HIGH, { width: 100, height: 140 }],
  ]);

  getAllSizes(): Map<PlayerSizeLevels, Dimensions> {
    return this.sizes;
  }

  getSize(playerSizeLevel: PlayerSizeLevels): Dimensions {
    return this.sizes.get(playerSizeLevel) || this.defaultSize;
  }
}
