import { Directions } from "../../enum/Directions";
import { Statuses } from "../../enum/Statuses";
import { StateHandlerServiceBase } from "../../service/base/StateHandlerServiceBase";

export class ControlService extends StateHandlerServiceBase {
  private readonly frequency = 16;
  private readonly isPressedMap = new Set<string>();
  private isNoPressedKeys = false;

  init(): void {
    this.interval();

    document.body.addEventListener("keydown", (event: KeyboardEvent) => {
      const state = this.getState();

      if (state.status === Statuses.READY && event.code == "Space") {
        this.stateService.setStatus(Statuses.RUN);
      } else if (
        state.status === Statuses.RUN &&
        !this.isPressedMap.has(event.code) &&
        (event.code == "ArrowLeft" || event.code == "ArrowRight")
      ) {
        this.isNoPressedKeys = false;
        this.isPressedMap.add(event.code);
      } else if (state.status === Statuses.END && event.code == "Space") {
        this.isNoPressedKeys = true;
        this.isPressedMap.clear();

        this.stateService.setStatus(Statuses.RESTART);
      }
    });

    document.body.addEventListener("keyup", (event: KeyboardEvent) => {
      const state = this.getState();

      if (state.status === Statuses.RUN && (event.code == "ArrowRight" || event.code == "ArrowLeft")) {
        this.isPressedMap.delete(event.code);
      }
    });
  }

  private interval = () => {
    const values = Array.from(this.isPressedMap.values());
    const key = values.pop();

    if (key == "ArrowLeft") {
      this.stateService.movePlayer(Directions.LEFT);
    } else if (key == "ArrowRight") {
      this.stateService.movePlayer(Directions.RIGHT);
    } else if (!this.isNoPressedKeys) {
      this.isNoPressedKeys = true;
      this.stateService.stopPlayer();
    }

    setTimeout(this.interval, this.frequency);
  };
}
