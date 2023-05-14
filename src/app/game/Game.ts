import { RendererService } from "./graphics/renderer/service/RendererService";
import { StateService } from "./logic/state/service/StateService";
import { GraphicsConfig } from "./graphics/interface/GraphicsConfig";
import { StateConfig } from "./logic/interface/LogicConfig";
import { Dimensions } from "./math/interface/Dimensions";
import { Statuses } from "./logic/enum/Statuses";
import { MathService } from "./math/service/MathService";

export class Game {
  private readonly stateService: StateService;
  private readonly rendererService: RendererService;

  constructor(selector: HTMLElement, dimensions: Dimensions, graphicsConfig: GraphicsConfig, stateConfig: StateConfig) {
    this.stateService = new StateService(dimensions, this.getStatusActions(), stateConfig);
    this.rendererService = new RendererService(selector, dimensions, graphicsConfig);
  }

  init() {
    this.rendererService.init(this.gameLoop).then((isInit: boolean) => {
      if (isInit) {
        this.stateService.setStatus(Statuses.READY);
      }
    });
  }

  private ready = () => {
    this.rendererService.create(this.stateService.getState());
  };

  private run = () => {
    this.rendererService.start();
  };

  private pause = () => {};

  private end = () => {
    this.rendererService.stop(this.stateService.getState());
  };

  private restart = () => {
    this.stateService.revertState();
    this.rendererService.restart(this.stateService.getState());
    this.stateService.setStatus(Statuses.RUN);
  };

  private gameLoop = (tick: number) => {
    if (this.stateService.getState().status == Statuses.RUN) {
      const frame = this.stateService.getFrame(MathService.round(tick));

      this.rendererService.refresh(frame);
    }
  };

  private getStatusActions(): Map<Statuses, () => void> {
    return new Map<Statuses, () => void>([
      [Statuses.NEW, this.init],
      [Statuses.READY, this.ready],
      [Statuses.RUN, this.run],
      [Statuses.PAUSE, this.pause],
      [Statuses.END, this.end],
      [Statuses.RESTART, this.restart],
    ]);
  }
}
