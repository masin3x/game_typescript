import { Dimensions } from "../../../math/interface/Dimensions";
import { MathService } from "../../../math/service/MathService";
import { StateHandlerServiceBase } from "../../service/base/StateHandlerServiceBase";
import { SceneRatioValues } from "../enum/SceneRatioValues";
import { Scene } from "../interface/Scene";

export class SceneService extends StateHandlerServiceBase {
  createScene(dimensions: Dimensions): Scene {
    const height = dimensions.height;
    const width = dimensions.width;
    const skyHeight = MathService.round(height * SceneRatioValues.MEDIUM);
    const groundHeight = MathService.round(height * (1 - SceneRatioValues.MEDIUM));

    return {
      sky: {
        position: {
          coordinates: {
            x: 0,
            y: 0,
          },
          dimensions: {
            width: width,
            height: skyHeight,
          },
        },
        material: {
          color: "#6eacd9",
        },
        aid: "sky",
      },
      ground: {
        position: {
          coordinates: {
            x: 0,
            y: skyHeight,
          },
          dimensions: {
            width: width,
            height: groundHeight,
          },
        },
        material: {
          color: "#8fce00",
        },
        aid: "ground",
      },
    };
  }
}
