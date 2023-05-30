import { StateService } from "./logic/state/service/StateService";
import { Dimensions } from "./math/interface/Dimensions";
import { Statuses } from "./logic/enum/Statuses";
import { MathService } from "./math/service/MathService";
import { Container } from "./core/Container";
import { DisplayService } from "./display/service/DisplayService";

export class Game {
  private readonly stateService: StateService;
  private readonly displayService: DisplayService;
  private readonly mathService: MathService;

  constructor(selector: HTMLElement, dimensions: Dimensions) {
    this.stateService = Container.resolve(StateService, dimensions, this.getStatusActions());
    this.displayService = Container.resolve(DisplayService, selector, dimensions);
    this.mathService = Container.resolve(MathService);
  }

  init() {
    this.displayService.init(this.gameLoop).then((results: boolean[]) => {
      if (!results.includes(false)) {
        this.stateService.setStatus(Statuses.READY);
      }
    });
  }

  private ready = () => {
    this.displayService.create(this.stateService.getState());
  };

  private run = () => {
    this.displayService.start();
  };

  private pause = () => {};

  private end = () => {
    this.displayService.stop(this.stateService.getState());
  };

  private restart = () => {
    this.stateService.revertState();
    this.displayService.restart(this.stateService.getState());
    this.stateService.setStatus(Statuses.RUN);
  };

  private gameLoop = (tick: number) => {
    if (this.stateService.getState().status == Statuses.RUN) {
      const frame = this.stateService.getFrame(this.mathService.round(tick));

      this.displayService.refresh(frame);
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
