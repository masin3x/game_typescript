import { TextureAIDs } from "../enum/TextureAIDs";
import { TextureMatadata } from "../interface/TextureMatadata";

export class MaterialService {
  getTextures(): TextureMatadata[] {
    return [
      {
        aid: TextureAIDs.FOOD,
        path: "/images/item/food.png",
        frameSize: { width: 16, height: 16 },
        maxFrameIndex: { x: 7, y: 7 },
      },
      {
        aid: TextureAIDs.PLAYER,
        path: "/images/player/player.png",
        frameSize: { width: 84, height: 84 },
        maxFrameIndex: { x: 5, y: 3 },
      },
      {
        aid: TextureAIDs.LIFE_LABEL,
        path: "/images/player/life_label.png",
        frameSize: { width: 84, height: 84 },
        maxFrameIndex: { x: 0, y: 0 },
      },
    ];
  }
}
