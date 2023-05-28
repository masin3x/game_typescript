import { Coordinates } from "../../../../math/interface/Coordinates";
import { Dimensions } from "../../../../math/interface/Dimensions";
import { Rect } from "../../../../math/interface/Rect";
import { TextureFrame } from "../../../material/interface/TextureFrame";
import { TextureMatadata } from "../../../material/interface/TextureMatadata";
import { Animation } from "../../interface/Animation";
import { TextConfig } from "../../interface/TextConfig";

export abstract class GraphicsEngineBase {
  protected readonly htmlElement: HTMLElement;
  protected readonly dimensions: Dimensions;

  constructor(htmlElement: HTMLElement, dimensions: Dimensions) {
    this.htmlElement = htmlElement;
    this.dimensions = dimensions;
  }

  abstract loadTextures(textureMatadatas: TextureMatadata[]): Promise<boolean>;

  abstract initEngineLoop(loop: (delta: number) => void): void;
  abstract stopEngineLoop(): void;
  abstract startEngineLoop(): void;

  abstract createRect(aid: string, rect: Rect, color?: string): void;
  abstract moveRect(aid: string, movement: Coordinates): void;
  abstract changeRectSize(aid: string, rect: Rect, color?: string): void;

  abstract createText(aid: string, text: string | number, textConfig: TextConfig, animation?: Animation): void;
  abstract editText(aid: string, text: string | number): void;

  abstract createSprite(aid: string, rect: Rect, textureFrame: TextureFrame, textureFrameKey?: string): void;
  abstract changeSpirteTextureFrame(aid: string, textureKey: string): void;
  abstract moveSprite(aid: string, movement: Coordinates, color?: string): void;
  abstract changeSpriteSize(aid: string, rect: Rect, textureKey: string): void;

  abstract deleteObject(aid: string): void;
  abstract deleteAllObjects(): void;
}
