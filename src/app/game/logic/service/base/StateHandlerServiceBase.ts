import { State } from "../../state/interface/State";
import { StateService } from "../../state/service/StateService";

export abstract class StateHandlerServiceBase {
  protected readonly stateService: StateService;

  constructor(stateService: StateService) {
    this.stateService = stateService;
  }

  protected getState(): State {
    return this.stateService.getState();
  }
}
