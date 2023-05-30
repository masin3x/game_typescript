import { Container } from "../../core/Container";
import { ItemTypes } from "../../logic/item/enum/ItemTypes";
import { Item } from "../../logic/item/interface/Item";
import { ItemFrame } from "../../logic/item/interface/ItemFrame";
import { Levels } from "../../logic/level/enum/Levels";
import { Player } from "../../logic/player/interface/Player";
import { PlayerFrame } from "../../logic/player/interface/PlayerFrame";
import { PlayerState } from "../../logic/player/interface/PlayerState";
import { Scene } from "../../logic/scene/interface/Scene";
import { Frame } from "../../logic/state/interface/Frame";
import { State } from "../../logic/state/interface/State";
import { Dimensions } from "../../math/interface/Dimensions";
import { AudioAIDs } from "../audio/enum/AudioAIDs";
import { AudioService } from "../audio/service/AudioService";
import { TextureAIDs } from "../graphics/enum/TextureAIDs";
import { GraphicsService } from "../graphics/service/GraphicsService";

export class DisplayService {
  private readonly POSITIVE_COLOR = "#0f5200";
  private readonly NEGATIVE_COLOR = "#D70400";
  private readonly DEFAULT_COLOR = "#FFFFFF";

  private readonly audioService: AudioService;
  private readonly graphicsService: GraphicsService;

  private readonly dimensions: Dimensions;

  constructor(selector: HTMLElement, dimensions: Dimensions) {
    this.dimensions = dimensions;

    this.audioService = Container.resolve(AudioService);
    this.graphicsService = Container.resolve(GraphicsService, selector, dimensions);
  }

  init(engineloop: (delta: number) => void): Promise<boolean[]> {
    return Promise.all([this.graphicsService.init(engineloop), this.audioService.init()]);
  }

  create(state: State) {
    this.createScene(state.scene, state.level);
    this.createPlayer(state.scene, state.firstPlayer, state.firstPlayerState);

    this.graphicsService.startEngineLoop();
  }

  start() {
    this.graphicsService.deleteObject("labelStartInfo");
    this.graphicsService.deleteObject("labelRestartInfo");
  }

  refresh(frame: Frame) {
    if (frame.items) {
      this.refreshItems(frame.items);
    }

    if (frame.firstPlayerFrame) {
      this.refreshPlayer(frame.firstPlayerFrame);
    }

    if (frame.level) {
      this.graphicsService.editText("labelLevelValue", frame.level);

      this.graphicsService.createText(
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

      this.audioService.play(AudioAIDs.LEVEL_UP);
    }
  }

  restart(state: State) {
    this.graphicsService.deleteObject("endLabelName");
    this.graphicsService.deleteObject("endLabelValue");

    this.graphicsService.deleteObject("labelPlayerPointsValue");
    this.graphicsService.deleteObject("labelPlayerLifesValue");
    this.graphicsService.deleteObject("labelPlayerLifesName");

    this.createPlayer(state.scene, state.firstPlayer, state.firstPlayerState);

    this.graphicsService.editText("labelLevelValue", state.level);
  }

  stop(state: State) {
    state.items.forEach((item: Item) => {
      this.graphicsService.deleteObject(item.aid);
    });

    this.graphicsService.deleteObject(state.firstPlayer.aid);

    this.graphicsService.createText("endLabelName", "GAME OVER, YOUR RESULT:", {
      font: "Arial",
      size: 64,
      color: this.DEFAULT_COLOR,
      coordinates: { x: 0, y: 200 },
      centerRangeX: { min: 0, max: this.dimensions.width },
    });

    this.graphicsService.createText("endLabelValue", (state.firstPlayerState.points + "").padStart(6, "0"), {
      font: "Arial",
      size: 48,
      color: this.DEFAULT_COLOR,
      coordinates: { x: 0, y: 310 },
      isBold: true,
      centerRangeX: { min: 0, max: this.dimensions.width },
    });

    this.graphicsService.createText("labelRestartInfo", "Press space to restart", {
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
        this.graphicsService.createSprite(item.aid, item.position, item.material.texture);
      }
    });

    itemFrame.updated.forEach((item: Item) => {
      this.graphicsService.moveSprite(item.aid, item.actualPosition().coordinates, item.material.color);
    });

    itemFrame.deleted.forEach((item: Item) => {
      this.graphicsService.deleteObject(item.aid);

      if (item.type === ItemTypes.POSITIVE_POINTS) {
        this.graphicsService.createText(
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

        this.audioService.play(AudioAIDs.PICKUP_LOSS);
      }
    });

    itemFrame.catchedByFirstPlayer.forEach((item: Item) => {
      this.graphicsService.deleteObject(item.aid);

      if (item.type === ItemTypes.POSITIVE_POINTS || item.type === ItemTypes.NEGATIVE_POINTS) {
        this.graphicsService.createText(
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

        item.isPositive
          ? this.audioService.play(AudioAIDs.PICKUP_POSITIVE)
          : this.audioService.play(AudioAIDs.PICKUP_NEGATIVE);
      } else if (item.type === ItemTypes.HEALTH || item.type === ItemTypes.SPEED || item.type === ItemTypes.SIZE) {
        if (item.value > 0) {
          this.graphicsService.createText(
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
          this.graphicsService.createText(
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
          this.graphicsService.createText(
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
          this.graphicsService.createText(
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

        this.audioService.play(AudioAIDs.PICKUP_POWERUP);
      }
    });
  }

  private refreshPlayer(playerFrame: PlayerFrame) {
    if (playerFrame.coordinates && playerFrame.movement) {
      this.graphicsService.moveSprite(playerFrame.aid, playerFrame.coordinates);
      this.audioService.play(AudioAIDs.STEP);
    }

    if (playerFrame.frameTextureKey !== undefined) {
      this.graphicsService.changeSpirteTextureFrame(playerFrame.aid, playerFrame.frameTextureKey);
    }

    if (playerFrame.lifes !== undefined) {
      this.graphicsService.editText("labelPlayerLifesValue", (playerFrame.lifes + "").padStart(2, "0"));
    }

    if (playerFrame.points !== undefined) {
      this.graphicsService.editText("labelPlayerPointsValue", (playerFrame.points + "").padStart(6, "0"));
    }

    if (playerFrame.size !== undefined && playerFrame.textureKey && playerFrame.actualPosition) {
      this.graphicsService.changeSpriteSize(playerFrame.aid, playerFrame.actualPosition, playerFrame.textureKey);
    }
  }

  private createPlayer(scene: Scene, player: Player, playerState: PlayerState): void {
    if (player.material?.texture && playerState.frameTextureKey) {
      this.graphicsService.createSprite(
        player.aid,
        player.position,
        player.material.texture,
        playerState.frameTextureKey
      );
    }

    this.graphicsService.createText("labelPlayerPointsValue", (playerState.points + "").padStart(6, "0"), {
      font: "Arial",
      size: 54,
      color: this.DEFAULT_COLOR,
      coordinates: { x: 20, y: 20 },
    });

    this.graphicsService.createText("labelPlayerLifesValue", (playerState.lifes + "").padStart(2, "0"), {
      font: "Arial",
      size: 54,
      color: this.DEFAULT_COLOR,
      coordinates: { x: scene.sky.position.dimensions.width - 120, y: 20 },
    });

    this.graphicsService.createSprite(
      "labelPlayerLifesName",
      { coordinates: { x: scene.sky.position.dimensions.width - 70, y: 13 }, dimensions: { width: 60, height: 60 } },
      {
        aid: TextureAIDs.LIFE_LABEL,
        frame: { x: 0, y: 0 },
      }
    );
  }

  private createScene(scene: Scene, level: Levels): void {
    const sky = scene.sky;
    const ground = scene.ground;

    this.graphicsService.createRect(sky.aid, sky.position, sky.material.color);
    this.graphicsService.createRect(ground.aid, ground.position, ground.material.color);

    this.graphicsService.createText("labelLevelName", "level", {
      font: "Arial",
      size: 24,
      color: "#ffffff",
      coordinates: { x: 0, y: 20 },
      centerRangeX: { min: 0, max: sky.position.dimensions.width },
    });

    this.graphicsService.createText("labelLevelValue", level, {
      font: "Arial",
      size: 30,
      color: "#ffffff",
      coordinates: { x: 0, y: 45 },
      centerRangeX: { min: 0, max: sky.position.dimensions.width },
    });

    this.graphicsService.createText("labelStartInfo", "Press space to start", {
      font: "Arial",
      size: 40,
      color: "#ffffff",
      coordinates: { x: 0, y: 0 },
      centerRangeX: { min: 0, max: sky.position.dimensions.width },
      centerRangeY: { min: 0, max: ground.position.coordinates.y + ground.position.dimensions.height },
    });
  }
}
