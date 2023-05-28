import { State } from "../interface/State";
import { StateConfig } from "../../interface/LogicConfig";
import { PlayerService } from "../../player/service/PlayerService";
import { Dimensions } from "../../../math/interface/Dimensions";
import { SceneService } from "../../scene/service/SceneService";
import { ControlService } from "../../control/service/ControlService";
import { Statuses } from "../../enum/Statuses";
import { Directions } from "../../enum/Directions";
import { Levels } from "../../level/enum/Levels";
import { ItemService } from "../../item/service/ItemService";
import { Item } from "../../item/interface/Item";
import { Frame } from "../interface/Frame";
import { LevelRulesService } from "../../level/service/LevelRulesService";
import { Modes } from "../../enum/Modes";
import { Container } from "../../../core/Container";

export class StateService {
  private readonly state: State;
  private readonly statusActions: Map<Statuses, () => void>;
  private readonly dimensions: Dimensions;
  private readonly playerService: PlayerService;
  private readonly sceneService: SceneService;
  private readonly controlService: ControlService;
  private readonly itemService: ItemService;
  private readonly levelRulesService: LevelRulesService;

  constructor(dimensions: Dimensions, statusActions: Map<Statuses, () => void>, stateConfig: StateConfig) {
    this.itemService = Container.resolve(ItemService, this);
    this.sceneService = Container.resolve(SceneService, this);
    this.playerService = Container.resolve(PlayerService, this);
    this.controlService = Container.resolve(ControlService, this);
    this.levelRulesService = Container.resolve(LevelRulesService, this);

    this.state = this.createState(stateConfig, dimensions);
    this.statusActions = statusActions;
    this.dimensions = dimensions;

    this.controlService.init();
  }

  private createState(stateConfig: StateConfig, dimensions: Dimensions): State {
    const scene = this.sceneService.createScene(dimensions);
    const firstPlayer = this.playerService.createPlayer(scene);

    return {
      mode: Modes.DEFAULT,
      status: Statuses.NEW,
      scene: scene,
      firstPlayer: firstPlayer,
      firstPlayerState: this.playerService.createPlayerState(),
      secondPlayer: null,
      secondPlayerState: null,
      items: new Map<string, Item>(),
      level: Levels.ONE,
      timeSinceLastGenerate: 250,
    };
  }

  revertState() {
    this.state.firstPlayer = this.playerService.createPlayer(this.state.scene);
    this.state.firstPlayerState = this.playerService.createPlayerState();
    this.state.level = Levels.ONE;
    this.state.timeSinceLastGenerate = 250;
    this.state.items.clear();
  }

  getState(): State {
    return this.state;
  }

  getFrame(scalar: number): Frame {
    if (this.state.firstPlayerState.lifes < 1) {
      this.setStatus(Statuses.END);

      return {};
    }

    const actualLevel = this.state.level;
    const levelRules = this.levelRulesService.getRulesByLevel(actualLevel);

    if (levelRules) {
      const itemFrame = this.itemService.refresh(scalar);
      const playerFrame = this.playerService.getPlayerFrame(
        scalar,
        this.state.firstPlayer,
        this.state.firstPlayerState,
        itemFrame.deleted,
        itemFrame.catchedByFirstPlayer
      );

      if (levelRules.catchedLimit && this.state.firstPlayerState.catchedCount >= levelRules.catchedLimit) {
        this.state.level++;
      }

      return {
        items: itemFrame,
        firstPlayerFrame: playerFrame,
        level: this.state.level != actualLevel ? this.state.level : undefined,
      };
    } else {
      return {};
    }
  }

  movePlayer(direction: Directions) {
    this.playerService.movePlayer(this.state.firstPlayer, this.state.firstPlayerState, direction, this.dimensions);
  }

  stopPlayer() {
    this.playerService.stopPlayer(this.state.firstPlayerState);
  }

  setStatus(status: Statuses) {
    this.state.status = status;

    const statusFunc: (() => void) | undefined = this.statusActions.get(status);

    if (statusFunc) {
      statusFunc();
    }
  }
}
