import { GraphicsConfig } from "../../interface/GraphicsConfig";
import { Player } from "../../../logic/player/interface/Player";
import { Scene } from "../../../logic/scene/interface/Scene";
import { State } from "../../../logic/state/interface/State";
import { Dimensions } from "../../../math/interface/Dimensions";
import { GraphicsEngineBase } from "../../engine/service/base/GraphicsEngineBase";
import { Levels } from "../../../logic/level/enum/Levels";
import { PlayerState } from "../../../logic/player/interface/PlayerState";
import { Statuses } from "../../../logic/enum/Statuses";
import { Frame } from "../../../logic/state/interface/Frame";
import { Item } from "../../../logic/item/interface/Item";
import { ItemFrame } from "../../../logic/item/interface/ItemFrame";
import { PlayerFrame } from "../../../logic/player/interface/PlayerFrame";
import { MaterialService } from "../../material/service/MaterialService";
import { ItemTypes } from "../../../logic/item/enum/ItemTypes";
import { TextureAIDs } from "../../material/enum/TextureAIDs";
import { Container } from "../../../core/Container";

export class RendererService {
  private readonly POSITIVE_COLOR = "#0f5200";
  private readonly NEGATIVE_COLOR = "#D70400";
  private readonly DEFAULT_COLOR = "#FFFFFF";

  private readonly graphicsEngine: GraphicsEngineBase;
  private readonly graphicsConfig: GraphicsConfig;
  private readonly dimensions: Dimensions;

  constructor(selector: HTMLElement, dimensions: Dimensions, graphicsConfig: GraphicsConfig) {
    this.graphicsEngine = Container.resolve(GraphicsEngineBase, selector, dimensions);
    this.graphicsConfig = graphicsConfig;
    this.dimensions = dimensions;
  }

  init(engineloop: (delta: number) => void): Promise<boolean> {
    this.graphicsEngine.initEngineLoop(engineloop);
    return this.graphicsEngine.loadTextures(MaterialService.getTextures());
  }

  create(state: State) {
    this.createScene(state.scene, state.level, state.status);
    this.createPlayer(state.scene, state.firstPlayer, state.firstPlayerState);

    this.graphicsEngine.startEngineLoop();
  }

  start() {
    this.graphicsEngine.deleteObject("labelStartInfo");
    this.graphicsEngine.deleteObject("labelRestartInfo");
  }

  restart(state: State) {
    this.graphicsEngine.deleteObject("endLabelName");
    this.graphicsEngine.deleteObject("endLabelValue");

    this.graphicsEngine.deleteObject("labelPlayerPointsValue");
    this.graphicsEngine.deleteObject("labelPlayerLifesValue");
    this.graphicsEngine.deleteObject("labelPlayerLifesName");

    this.createPlayer(state.scene, state.firstPlayer, state.firstPlayerState);

    this.graphicsEngine.editText("labelLevelValue", state.level);
  }

  refresh(frame: Frame) {
    if (frame.items) {
      this.refreshItems(frame.items);
    }

    if (frame.firstPlayerFrame) {
      this.refreshPlayer(frame.firstPlayerFrame);
    }

    if (frame.level) {
      this.graphicsEngine.editText("labelLevelValue", frame.level);

      this.graphicsEngine.createText(
        "labelLevelValue_" + frame.level,
        "LEVEL UP!",
        {
          font: "Arial",
          size: 64,
          color: this.DEFAULT_COLOR,
          coordinates: { x: 0, y: 0 },
          centerRangeX: { min: 0, max: this.dimensions.width },
          centerRangeY: { min: 0, max: this.dimensions.height },
        },
        { timeDuration: 40, currentTime: 0 }
      );
    }
  }

  stop(state: State) {
    state.items.forEach((item: Item) => {
      if (this.graphicsConfig.isDrawRect) {
        this.graphicsEngine.deleteObject(item.aid + "_rect");
      }

      this.graphicsEngine.deleteObject(item.aid);
    });

    if (this.graphicsConfig.isDrawRect) {
      this.graphicsEngine.deleteObject(state.firstPlayer.aid + "_rect");
    }

    this.graphicsEngine.deleteObject(state.firstPlayer.aid);

    this.graphicsEngine.createText("endLabelName", "GAME OVER, YOUR RESULT:", {
      font: "Arial",
      size: 64,
      color: this.DEFAULT_COLOR,
      coordinates: { x: 0, y: 200 },
      centerRangeX: { min: 0, max: this.dimensions.width },
    });

    this.graphicsEngine.createText("endLabelValue", (state.firstPlayerState.points + "").padStart(6, "0"), {
      font: "Arial",
      size: 48,
      color: this.DEFAULT_COLOR,
      coordinates: { x: 0, y: 310 },
      isBold: true,
      centerRangeX: { min: 0, max: this.dimensions.width },
    });

    this.graphicsEngine.createText("labelRestartInfo", "Press space to restart", {
      font: "Arial",
      size: 40,
      color: "#ffffff",
      coordinates: { x: 0, y: 400 },
      centerRangeX: { min: 0, max: this.dimensions.width },
    });
  }

  private refreshItems(itemFrame: ItemFrame) {
    itemFrame.created.forEach((item: Item) => {
      if (item.material?.texture) {
        if (this.graphicsConfig.isDrawRect) {
          this.graphicsEngine.createRect(item.aid + "_rect", item.position, item.material.color);
        }

        this.graphicsEngine.createSprite(item.aid, item.position, item.material.texture);
      }
    });

    itemFrame.updated.forEach((item: Item) => {
      if (this.graphicsConfig.isDrawRect) {
        this.graphicsEngine.moveRect(item.aid + "_rect", item.movement);
      }

      this.graphicsEngine.moveSprite(item.aid, item.actualPosition().coordinates, item.material.color);
    });

    itemFrame.deleted.forEach((item: Item) => {
      if (this.graphicsConfig.isDrawRect) {
        this.graphicsEngine.deleteObject(item.aid + "_rect");
      }

      this.graphicsEngine.deleteObject(item.aid);

      if (item.type === ItemTypes.POSITIVE_POINTS) {
        this.graphicsEngine.createText(
          item.aid + "_value",
          "-1 HP",
          {
            font: "Arial",
            size: 18,
            color: "#D70400",
            coordinates: { x: item.actualPosition().coordinates.x, y: item.actualPosition().coordinates.y },
          },
          { sizeScalar: 0.02, movmentFunction: { a: -1, b: 0 }, timeDuration: 30, currentTime: 0 }
        );
      }
    });

    itemFrame.catchedByFirstPlayer.forEach((item: Item) => {
      if (this.graphicsConfig.isDrawRect) {
        this.graphicsEngine.deleteObject(item.aid + "_rect");
      }

      this.graphicsEngine.deleteObject(item.aid);

      if (item.type === ItemTypes.POSITIVE_POINTS || item.type === ItemTypes.NEGATIVE_POINTS) {
        this.graphicsEngine.createText(
          item.aid + "_value",
          (item.isPositive ? "+" : "-") + " " + item.value + " PTS",
          {
            font: "Arial",
            size: 18,
            color: item.isPositive ? this.POSITIVE_COLOR : this.NEGATIVE_COLOR,
            coordinates: { x: item.actualPosition().coordinates.x, y: item.actualPosition().coordinates.y },
          },
          { sizeScalar: 0.02, movmentFunction: { a: -1, b: 0 }, timeDuration: 30, currentTime: 0 }
        );
      } else if (item.type === ItemTypes.HEALTH || item.type === ItemTypes.SPEED || item.type === ItemTypes.SIZE) {
        if (item.value > 0) {
          this.graphicsEngine.createText(
            item.aid + "1_value",
            "+" + item.value + " PTS",
            {
              font: "Arial",
              size: 18,
              color: this.POSITIVE_COLOR,
              coordinates: { x: item.actualPosition().coordinates.x, y: item.actualPosition().coordinates.y },
            },
            { sizeScalar: 0.02, movmentFunction: { a: -1, b: 0 }, timeDuration: 30, currentTime: 0 }
          );
        }

        if (item.type === ItemTypes.HEALTH) {
          this.graphicsEngine.createText(
            item.aid + "2_value",
            (item.isPositive ? "+" : "-") + "1 HP",
            {
              font: "Arial",
              size: 18,
              color: item.isPositive ? this.POSITIVE_COLOR : this.NEGATIVE_COLOR,
              coordinates: { x: item.actualPosition().coordinates.x, y: item.actualPosition().coordinates.y },
            },
            { sizeScalar: 0.02, movmentFunction: { a: 1, b: 0 }, timeDuration: 30, currentTime: 0 }
          );
        } else if (item.type === ItemTypes.SPEED) {
          this.graphicsEngine.createText(
            item.aid + "2_value",
            (item.isPositive ? "+" : "-") + "SPEED",
            {
              font: "Arial",
              size: 18,
              color: item.isPositive ? this.POSITIVE_COLOR : this.NEGATIVE_COLOR,
              coordinates: { x: item.actualPosition().coordinates.x, y: item.actualPosition().coordinates.y },
            },
            { sizeScalar: 0.02, movmentFunction: { a: 1, b: 0 }, timeDuration: 30, currentTime: 0 }
          );
        } else if (item.type === ItemTypes.SIZE) {
          this.graphicsEngine.createText(
            item.aid + "2_value",
            (item.isPositive ? "+" : "-") + "SIZE",
            {
              font: "Arial",
              size: 18,
              color: item.isPositive ? this.POSITIVE_COLOR : this.NEGATIVE_COLOR,
              coordinates: { x: item.actualPosition().coordinates.x, y: item.actualPosition().coordinates.y },
            },
            { sizeScalar: 0.02, movmentFunction: { a: 1, b: 0 }, timeDuration: 30, currentTime: 0 }
          );
        }
      }
    });
  }

  private refreshPlayer(playerFrame: PlayerFrame) {
    if (playerFrame.coordinates && playerFrame.movement) {
      if (this.graphicsConfig.isDrawRect) {
        this.graphicsEngine.moveRect(playerFrame.aid + "_rect", playerFrame.movement);
      }

      this.graphicsEngine.moveSprite(playerFrame.aid, playerFrame.coordinates);
    }

    if (playerFrame.frameTextureKey !== undefined) {
      this.graphicsEngine.changeSpirteTextureFrame(playerFrame.aid, playerFrame.frameTextureKey);
    }

    if (playerFrame.lifes !== undefined) {
      this.graphicsEngine.editText("labelPlayerLifesValue", (playerFrame.lifes + "").padStart(2, "0"));
    }

    if (playerFrame.points !== undefined) {
      this.graphicsEngine.editText("labelPlayerPointsValue", (playerFrame.points + "").padStart(6, "0"));
    }

    if (playerFrame.size !== undefined) {
      if (this.graphicsConfig.isDrawRect && playerFrame.position && playerFrame.color) {
        this.graphicsEngine.changeRectSize(playerFrame.aid + "_rect", playerFrame.position, playerFrame.color);
      }

      if (playerFrame.textureKey && playerFrame.actualPosition) {
        this.graphicsEngine.changeSpriteSize(playerFrame.aid, playerFrame.actualPosition, playerFrame.textureKey);
      }
    }
  }

  private createPlayer(scene: Scene, player: Player, playerState: PlayerState): void {
    if (player.material?.texture && playerState.frameTextureKey) {
      if (this.graphicsConfig.isDrawRect) {
        this.graphicsEngine.createRect(player.aid + "_rect", player.position, player.material.color);
      }

      this.graphicsEngine.createSprite(
        player.aid,
        player.position,
        player.material.texture,
        playerState.frameTextureKey
      );
    }

    this.graphicsEngine.createText("labelPlayerPointsValue", (playerState.points + "").padStart(6, "0"), {
      font: "Arial",
      size: 54,
      color: this.DEFAULT_COLOR,
      coordinates: { x: 20, y: 20 },
    });

    this.graphicsEngine.createText("labelPlayerLifesValue", (playerState.lifes + "").padStart(2, "0"), {
      font: "Arial",
      size: 54,
      color: this.DEFAULT_COLOR,
      coordinates: { x: scene.sky.position.dimensions.width - 120, y: 20 },
    });

    this.graphicsEngine.createSprite(
      "labelPlayerLifesName",
      { coordinates: { x: scene.sky.position.dimensions.width - 70, y: 13 }, dimensions: { width: 60, height: 60 } },
      {
        aid: TextureAIDs.LIFE_LABEL,
        frame: { x: 0, y: 0 },
      }
    );
  }

  private createScene(scene: Scene, level: Levels, status: Statuses): void {
    const sky = scene.sky;
    const ground = scene.ground;

    this.graphicsEngine.createRect(sky.aid, sky.position, sky.material.color);
    this.graphicsEngine.createRect(ground.aid, ground.position, ground.material.color);

    this.graphicsEngine.createText("labelLevelName", "level", {
      font: "Arial",
      size: 24,
      color: "#ffffff",
      coordinates: { x: 0, y: 20 },
      centerRangeX: { min: 0, max: sky.position.dimensions.width },
    });

    this.graphicsEngine.createText("labelLevelValue", level, {
      font: "Arial",
      size: 30,
      color: "#ffffff",
      coordinates: { x: 0, y: 45 },
      centerRangeX: { min: 0, max: sky.position.dimensions.width },
    });

    this.graphicsEngine.createText("labelStartInfo", "Press space to start", {
      font: "Arial",
      size: 40,
      color: "#ffffff",
      coordinates: { x: 0, y: 0 },
      centerRangeX: { min: 0, max: sky.position.dimensions.width },
      centerRangeY: { min: 0, max: ground.position.coordinates.y + ground.position.dimensions.height },
    });
  }
}
