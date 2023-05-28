import { Dimensions } from "../../../math/interface/Dimensions";
import { Rect } from "../../../math/interface/Rect";
import { MathService } from "../../../math/service/MathService";
import { Player } from "../interface/Player";
import { StateHandlerServiceBase } from "../../service/base/StateHandlerServiceBase";
import { Scene } from "../../scene/interface/Scene";
import { PlayerAIDs } from "../enum/PlayerAids";
import { PlayerFrame } from "../interface/PlayerFrame";
import { Item } from "../../item/interface/Item";
import { PlayerState } from "../interface/PlayerState";
import { ItemTypes } from "../../item/enum/ItemTypes";
import { PlayerSizeLevels } from "../enum/PlayerSizeLevels";
import { PlayerSizeService } from "./PlayerSizeService";
import { Coordinates } from "../../../math/interface/Coordinates";
import { TextureAIDs } from "../../../graphics/material/enum/TextureAIDs";
import { PlayerSpeedLevels } from "../enum/PlayerSpeedLevels";
import { Directions } from "../../enum/Directions";
import { Container } from "../../../core/Container";

export class PlayerService extends StateHandlerServiceBase {
  private readonly mathService: MathService = Container.resolve(MathService);
  private readonly playerSizeService: PlayerSizeService = Container.resolve(PlayerSizeService);
  private readonly POWER_UP_TIME = 600;

  createPlayer(scene: Scene): Player {
    return {
      aid: PlayerAIDs.FIRST,
      name: "Player1",
      position: this.getPlayerPositionBySizeLevel(PlayerSizeLevels.MEDIUM, scene),
      material: {
        color: "#cc0000",
        texture: {
          aid: TextureAIDs.PLAYER,
          frames: new Map<string, Coordinates[]>([
            [
              "IDLE",
              [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 2, y: 0 },
                { x: 3, y: 0 },
              ],
            ],
            [
              "RUN_RIGHT",
              [
                { x: 6, y: 1 },
                { x: 7, y: 1 },
                { x: 0, y: 2 },
                { x: 1, y: 2 },
                { x: 2, y: 2 },
                { x: 3, y: 2 },
              ],
            ],
            [
              "RUN_LEFT",
              [
                { x: 4, y: 2 },
                { x: 5, y: 2 },
                { x: 6, y: 2 },
                { x: 7, y: 2 },
                { x: 0, y: 3 },
                { x: 1, y: 3 },
              ],
            ],
          ]),
        },
      },
      movement: { x: 0, y: 0 },
      actualPosition: function (): Rect {
        return {
          coordinates: {
            x: this.position.coordinates.x + this.movement.x,
            y: this.position.coordinates.y + this.movement.y,
          },
          dimensions: this.position.dimensions,
        };
      },
    };
  }

  createPlayerState(): PlayerState {
    return {
      speed: PlayerSpeedLevels.MEDIUM,
      size: PlayerSizeLevels.MEDIUM,
      points: 0,
      lifes: 10,
      frameTextureKey: "IDLE",
      isMoved: false,
      isChangedDirection: false,
      catchedCount: 0,
      sizePowerUPCounter: null,
      speedPowerUPCounter: null,
    };
  }

  getPlayerFrame(
    scalar: number,
    player: Player,
    playerState: PlayerState,
    deletedItems: Item[],
    catchedItems: Item[]
  ): PlayerFrame {
    const playerFrame: PlayerFrame = {
      aid: player.aid,
    };

    if (playerState.isMoved) {
      playerFrame.coordinates = player.actualPosition().coordinates;
      playerFrame.movement = { x: player.movement.x, y: player.movement.y };
      playerState.isMoved = false;
    }

    if (playerState.isChangedDirection) {
      playerFrame.frameTextureKey = playerState.frameTextureKey;
      playerState.isChangedDirection = false;
    }

    deletedItems.forEach((item: Item) => {
      if (item.type === ItemTypes.POSITIVE_POINTS) {
        playerState.lifes--;
        playerFrame.lifes = playerState.lifes;
      }
    });

    catchedItems.forEach((item: Item) => {
      if (item.type === ItemTypes.POSITIVE_POINTS) {
        playerState.points += item.value;
        playerFrame.points = playerState.points;
        playerState.catchedCount++;
      } else if (item.type === ItemTypes.NEGATIVE_POINTS) {
        playerState.points -= item.value;
        playerFrame.points = playerState.points;
      } else if (item.type === ItemTypes.HEALTH) {
        playerState.lifes++;
        playerFrame.lifes = playerState.lifes;

        playerState.catchedCount++;
      } else if (item.type === ItemTypes.SPEED) {
        playerState.points += item.value;
        playerFrame.points = playerState.points;

        playerState.speed = item.isPositive ? PlayerSpeedLevels.HIGH : PlayerSpeedLevels.LOW;
        playerFrame.speed = playerState.speed;

        playerState.speedPowerUPCounter = 0;

        playerState.catchedCount++;
      } else if (item.type === ItemTypes.SIZE) {
        playerState.points += item.value;
        playerFrame.points = playerState.points;

        this.changePlayerDimensions(player, playerState, playerFrame, false, item);

        playerState.catchedCount++;
      }
    });

    if (playerState.sizePowerUPCounter != null) {
      playerState.sizePowerUPCounter += scalar;

      if (playerState.sizePowerUPCounter > this.POWER_UP_TIME) {
        this.changePlayerDimensions(player, playerState, playerFrame, true);
      }
    }

    if (playerState.speedPowerUPCounter != null) {
      playerState.speedPowerUPCounter += scalar;

      if (playerState.speedPowerUPCounter > this.POWER_UP_TIME) {
        playerState.speedPowerUPCounter = null;

        playerState.speed = PlayerSpeedLevels.MEDIUM;
        playerFrame.speed = playerState.speed;
      }
    }

    return playerFrame;
  }

  movePlayer(player: Player, playerState: PlayerState, direction: Directions, dimensions: Dimensions) {
    const state = this.getState();
    const position = player.actualPosition();

    let frameTextureKey = "";

    if (direction === Directions.LEFT) {
      frameTextureKey = "RUN_LEFT";

      if (position.coordinates.x > 0) {
        player.movement.x -= playerState.speed;
      }
    } else if (direction === Directions.RIGHT) {
      frameTextureKey = "RUN_RIGHT";

      if (position.coordinates.x + position.dimensions.width < dimensions.width) {
        player.movement.x += playerState.speed;
      }
    }

    playerState.isMoved = true;

    if (frameTextureKey != playerState.frameTextureKey) {
      playerState.isChangedDirection = true;
    }

    playerState.frameTextureKey = frameTextureKey;
  }

  stopPlayer(playerState: PlayerState) {
    if (playerState.frameTextureKey !== "IDLE") {
      playerState.isChangedDirection = true;
    }

    playerState.frameTextureKey = "IDLE";
  }

  private getPlayerPositionBySizeLevel(playerSizeLevel: PlayerSizeLevels, scene: Scene): Rect {
    const playerDimensions = this.playerSizeService.getSize(playerSizeLevel);

    const groundRect: Rect = scene.ground.position;
    const groundAverageValue = this.mathService.getAverageValue(
      groundRect.coordinates.x,
      groundRect.coordinates.x + groundRect.dimensions.width
    );

    const playerRect: Rect = this.mathService.createRectByCenterPoint(
      {
        x: groundAverageValue,
        y: groundRect.coordinates.y - playerDimensions.height / 2,
      },
      playerDimensions
    );

    return playerRect;
  }

  private changePlayerDimensions(
    player: Player,
    playerState: PlayerState,
    playerFrame: PlayerFrame,
    isReset: boolean,
    item?: Item
  ) {
    if (item && !isReset) {
      playerState.size = item.isPositive ? PlayerSizeLevels.HIGH : PlayerSizeLevels.LOW;
      playerState.sizePowerUPCounter = 0;
    } else if (isReset) {
      playerState.size = PlayerSizeLevels.MEDIUM;
      playerState.sizePowerUPCounter = null;
    }

    player.position = this.getPlayerPositionBySizeLevel(playerState.size, this.getState().scene);

    playerFrame.size = playerState.size;
    playerFrame.position = player.position;
    playerFrame.actualPosition = player.actualPosition();
    playerFrame.color = player.material.color;
    playerFrame.textureKey = TextureAIDs.PLAYER;
  }
}
