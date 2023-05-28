import { Container } from "../../../core/Container";
import { TextureAIDs } from "../../../graphics/material/enum/TextureAIDs";
import { Rect } from "../../../math/interface/Rect";
import { MathService } from "../../../math/service/MathService";
import { LevelRules } from "../../level/interface/LevelRules";
import { LevelRulesSerice } from "../../level/service/LevelRulesService";
import { Player } from "../../player/interface/Player";
import { StateHandlerServiceBase } from "../../service/base/StateHandlerServiceBase";
import { State } from "../../state/interface/State";
import { ItemSizeLevels } from "../enum/ItemSizeLevels";
import { ItemTypes } from "../enum/ItemTypes";
import { ItemValueLevels } from "../enum/ItemValueLevels";
import { Item } from "../interface/Item";
import { ItemFrame } from "../interface/ItemFrame";
import { ItemRulesService } from "./ItemRulesService";

export class ItemService extends StateHandlerServiceBase {
  private readonly mathService: MathService = Container.resolve(MathService);
  private readonly itemRulesService: ItemRulesService = Container.resolve(ItemRulesService);

  refresh(scalar: number): ItemFrame {
    const itemFrame = { created: [], updated: [], deleted: [], catchedByFirstPlayer: [], catchedBySecondPlayer: [] };
    const state = this.getState();
    const levelRules = LevelRulesSerice.getRulesByLevel(state.level);

    if (levelRules) {
      state.timeSinceLastGenerate += scalar;

      this.update(state, levelRules, itemFrame, scalar);

      if (state.timeSinceLastGenerate >= levelRules.itemGenerationFrequency) {
        state.timeSinceLastGenerate = 0;

        this.create(state, levelRules, itemFrame);
      }
    }

    return itemFrame;
  }

  private update(state: State, levelRules: LevelRules, itemFrame: ItemFrame, scalar: number) {
    const itemsToDelete: string[] = [];

    state.items.forEach((item: Item, key: string) => {
      if (this.isCatched(item, state.firstPlayer)) {
        itemFrame.catchedByFirstPlayer.push(item);
        itemsToDelete.push(key);
      } else if (state.secondPlayer && state.secondPlayerState && this.isCatched(item, state.secondPlayer)) {
        itemFrame.catchedBySecondPlayer.push(item);
        itemsToDelete.push(key);
      } else if (item.movement.y >= state.scene.ground.position.coordinates.y) {
        itemFrame.deleted.push(item);
        itemsToDelete.push(key);
      } else {
        item.movement.y += levelRules.itemsSpeed * scalar;
        itemFrame.updated.push(item);
      }
    });

    itemsToDelete.forEach((key: string) => {
      state.items.delete(key);
    });
  }

  private isCatched(item: Item, player: Player): boolean {
    return this.mathService.isRectIntersect(player.actualPosition(), item.actualPosition());
  }

  private create(state: State, levelRules: LevelRules, itemFrame: ItemFrame) {
    const itemSize = ItemSizeLevels.MEDIUM;
    const x = this.mathService.generateRandom(0, state.scene.sky.position.dimensions.width - itemSize);
    const type = this.mathService.getIndexWithPossibility(Array.from(levelRules.itemTypesPossibility.values())) + 1;
    const aid = "" + new Date().getTime();
    const itemIndex = this.mathService.generateRandom(0, 9);
    const frame = this.itemRulesService.getItemByTypeAndIndex(type, itemIndex);
    const value =
      type !== ItemTypes.HEALTH ? this.itemRulesService.getItemValueByIndex(itemIndex) : ItemValueLevels.NONE;

    const item: Item = {
      type: type,
      value: value,
      speed: levelRules.itemsSpeed,
      size: itemSize,
      isPositive: this.itemRulesService.getIsPositiveByType(type),
      movement: { x: 0, y: 0 },
      aid: aid,
      position: {
        coordinates: {
          x: x,
          y: -1 * itemSize,
        },
        dimensions: {
          width: itemSize,
          height: itemSize,
        },
      },
      actualPosition: function (): Rect {
        return {
          coordinates: {
            x: this.position.coordinates.x + this.movement.x,
            y: this.position.coordinates.y + this.movement.y,
          },
          dimensions: this.position.dimensions,
        };
      },
      material: {
        color: this.itemRulesService.getItemColorByType(type),
        texture: {
          aid: TextureAIDs.FOOD,
          frame: frame || { x: 0, y: 0 },
        },
      },
    };

    state.items.set(aid, item);
    itemFrame.created.push(item);
  }
}
