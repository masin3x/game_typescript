import { Coordinates } from "../../../../math/interface/Coordinates";
import { Dimensions } from "../../../../math/interface/Dimensions";
import { Rect } from "../../../../math/interface/Rect";
import { TextConfig } from "../../interface/TextConfig";
import { GraphicsEngineBase } from "../base/GraphicsEngineBase";
import { TextureMatadata } from "../../../material/interface/TextureMatadata";

import {
  Application,
  Graphics,
  TextStyle,
  Text,
  DisplayObject,
  Sprite,
  Texture,
  Resource,
  AnimatedSprite,
  Rectangle,
  Assets,
} from "pixi.js";
import { Animation } from "../../interface/Animation";
import { TextureFrame } from "../../../material/interface/TextureFrame";
import { MathService } from "../../../../math/service/MathService";
import { Container } from "../../../../core/Container";

export class PixiGraphicsEngine extends GraphicsEngineBase {
  protected readonly mathService: MathService;

  private app: Application<HTMLCanvasElement>;
  private textureMetadataMap: Map<string, TextureMatadata>;
  private frameTextureMap: Map<string, Texture[]>;
  private objectOffsets: Map<string, number>;
  private animationsMap: Map<string, Animation>;
  private loop: (delta: number) => void;
  private isLoopInit = false;

  constructor(htmlElement: HTMLElement, dimensions: Dimensions) {
    super(htmlElement, dimensions);

    this.mathService = Container.resolve(MathService);
    this.app = new Application<HTMLCanvasElement>(dimensions);
    this.textureMetadataMap = new Map<string, TextureMatadata>();
    this.frameTextureMap = new Map<string, Texture[]>();
    this.objectOffsets = new Map<string, number>();
    this.animationsMap = new Map<string, Animation>();

    htmlElement.appendChild(this.app.view);
  }

  initEngineLoop(loop: (delta: number) => void) {
    this.loop = loop;
  }

  stopEngineLoop(): void {
    this.app.ticker.stop();
  }

  startEngineLoop(): void {
    if (!this.isLoopInit) {
      this.app.ticker.add((delta) => {
        this.loop(delta);

        this.handleAnimations(delta);
      });
    }

    this.app.ticker.start();
  }

  loadTextures(textureMatadatas: TextureMatadata[]): Promise<boolean> {
    const aids: string[] = [];
    textureMatadatas.forEach((textureMatadata: TextureMatadata) => {
      Assets.add(textureMatadata.aid, textureMatadata.path);
      aids.push(textureMatadata.aid);
      this.textureMetadataMap.set(textureMatadata.aid, textureMatadata);
    });

    return new Promise<boolean>((resolve: Function, reject: Function) => {
      Assets.load(aids)
        .then((textures: Record<string, Texture>) => {
          resolve(true);
        })
        .catch(() => {
          reject(false);
        });
    });
  }

  changeRectSize(aid: string, rect: Rect, color?: string | undefined) {
    const child = this.getObject<Graphics>(aid);

    if (child) {
      child.clear();

      child.beginFill(color);
      child.name = aid;
      child.drawRect(rect.coordinates.x, rect.coordinates.y, rect.dimensions.width, rect.dimensions.height);
      child.endFill();
    }
  }

  createRect(aid: string, rect: Rect, color?: string | undefined) {
    const graphics: Graphics = new Graphics();

    graphics.beginFill(color);
    graphics.name = aid;
    graphics.drawRect(rect.coordinates.x, rect.coordinates.y, rect.dimensions.width, rect.dimensions.height);
    graphics.endFill();

    this.app.stage.addChild(graphics);
  }

  createText(aid: string, text: string | number, textConfig: TextConfig, animation?: Animation): void {
    const textObj = new Text(
      text,
      new TextStyle({
        fontFamily: textConfig.font,
        fontSize: textConfig.size,
        fontWeight: textConfig.isBold ? "bold" : "normal",
        fill: [textConfig.color || "#FFFFFF"],
      })
    );

    textObj.name = aid;

    this.app.stage.addChild(textObj);

    if (textConfig.centerRangeX) {
      const avg = this.mathService.getAverageValue(textConfig.centerRangeX.min, textConfig.centerRangeX.max);
      textObj.x = avg - this.mathService.round(textObj.width / 2);
    } else {
      textObj.x = textConfig.coordinates.x;
    }

    if (textConfig.centerRangeY) {
      const avg = this.mathService.getAverageValue(textConfig.centerRangeY.min, textConfig.centerRangeY.max);
      textObj.y = avg - this.mathService.round(textObj.height / 2);
    } else {
      textObj.y = textConfig.coordinates.y;
    }

    if (animation) {
      this.animationsMap.set(aid, { ...animation, ...{ currentTime: 0 } });
    }
  }

  editText(aid: string, text: string | number): void {
    const child = this.app.stage.getChildByName<Text>(aid);

    if (child !== null) {
      child.text = text;
    }
  }

  moveSprite(aid: string, movement: Coordinates, color?: string) {
    const child = this.getObject<Sprite | AnimatedSprite>(aid);

    if (child !== null) {
      const offset: number = this.objectOffsets.get(aid) || 0;

      child.x = movement.x - offset;
      child.y = movement.y;

      if (color) {
        if (child.y % 80 < 40) {
          child.tint = "#ffffff";
        } else {
          child.tint = color;
        }
      }
    }
  }

  moveRect(aid: string, movement: Coordinates) {
    const child = this.getObject<Graphics>(aid);

    if (child !== null) {
      const offset: number = this.objectOffsets.get(aid) || 0;

      child.x = movement.x - offset;
      child.y = movement.y;
    }
  }

  deleteObject(aid: string) {
    const child = this.getObject(aid);

    if (child !== null) {
      child.destroy();

      if (this.objectOffsets.has(aid)) {
        this.objectOffsets.delete(aid);
      }

      if (this.frameTextureMap.has(aid)) {
        this.frameTextureMap.delete(aid);
      }
    }
  }

  deleteAllObjects(): void {
    this.app.stage.removeChildren();
  }

  createSprite(aid: string, rect: Rect, textureFrame: TextureFrame, textureFrameKey?: string): void {
    if (textureFrame.frames && textureFrameKey) {
      this.handleCreateAnimatedSprite(
        aid,
        rect,
        textureFrame.aid,
        textureFrameKey,
        textureFrame.frames,
        textureFrame.animationSpeed
      );
    } else if (textureFrame.frame) {
      this.handleCreateSprite(aid, rect, textureFrame.aid, textureFrame.frame);
    }
  }

  changeSpirteTextureFrame(aid: string, textureKey: string) {
    const child = this.getObject<AnimatedSprite>(aid);

    if (child) {
      const texture = this.frameTextureMap.get(textureKey);

      if (texture) {
        child.textures = texture;
        child.gotoAndPlay(0);
      }
    }
  }

  changeSpriteSize(aid: string, rect: Rect, textureKey: string): void {
    const child = this.getObject<Sprite | AnimatedSprite>(aid);
    const textureMatadata = this.textureMetadataMap.get(textureKey);

    if (child && textureMatadata) {
      this.handleSpritePosition(aid, child, rect, textureMatadata.frameSize, false);
    }
  }

  private handleAnimations(scalar: number) {
    const keysToDelete: string[] = [];

    this.animationsMap.forEach((value: Animation, key: string) => {
      const child = this.app.stage.getChildByName<Text>(key);

      if (child) {
        value.currentTime += scalar;

        if (value.sizeScalar) {
          child.scale.x += value.sizeScalar * scalar;
          child.scale.y += value.sizeScalar * scalar;
        }

        if (value.movmentFunction && value.movmentFunction.a != 0) {
          child.x += scalar;
          child.y += scalar * value.movmentFunction.a + value.movmentFunction.b;
        }

        if (value.currentTime >= value.timeDuration) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach((key: string) => {
        const child = this.app.stage.getChildByName<Text>(key);

        if (child) {
          child.destroy();
          this.animationsMap.delete(key);
        }
      });
    });
  }

  private handleCreateSprite(aid: string, rect: Rect, textureAID: string, textureIndex: Coordinates) {
    const textureMatadata = this.textureMetadataMap.get(textureAID);

    if (textureMatadata) {
      const asset = Texture.from(Assets.get(textureAID).baseTexture);
      const newTexture = new Texture(
        asset.baseTexture,
        new Rectangle(
          textureMatadata.frameSize.width * textureIndex.x,
          textureMatadata.frameSize.height * textureIndex.y,
          textureMatadata.frameSize.width,
          textureMatadata.frameSize.height
        )
      );

      const sprite = Sprite.from(newTexture);
      sprite.name = aid;

      this.handleSpritePosition(aid, sprite, rect, textureMatadata.frameSize, true);

      this.app.stage.addChild(sprite);
    }
  }

  private handleCreateAnimatedSprite(
    aid: string,
    rect: Rect,
    textureAID: string,
    frameTextureAID: string,
    textureFrames: Map<string, Coordinates[]>,
    animationSpeed?: number
  ): void {
    const textureMatadata = this.textureMetadataMap.get(textureAID);

    if (textureMatadata) {
      const asset = Texture.from(Assets.get(textureAID).baseTexture);

      textureFrames.forEach((textureIndexes: Coordinates[], key: string) => {
        const textures: Texture<Resource>[] = [];

        textureIndexes.forEach((textureIndex: Coordinates) => {
          textures.push(
            new Texture(
              asset.baseTexture,
              new Rectangle(
                textureMatadata.frameSize.width * textureIndex.x,
                textureMatadata.frameSize.height * textureIndex.y,
                textureMatadata.frameSize.width,
                textureMatadata.frameSize.height
              )
            )
          );
        });

        this.frameTextureMap.set(key, textures);
      });

      const texture = this.frameTextureMap.get(frameTextureAID);

      if (texture) {
        const sprite = new AnimatedSprite(texture);
        sprite.name = aid;

        this.handleSpritePosition(aid, sprite, rect, textureMatadata.frameSize, true);

        sprite.animationSpeed = animationSpeed || 0.15;
        sprite.gotoAndPlay(0);

        this.app.stage.addChild(sprite);
      }
    }
  }

  private handleSpritePosition(
    aid: string,
    sprite: Sprite | AnimatedSprite,
    rect: Rect,
    textureSize: Dimensions,
    isSetCoordinates: boolean
  ) {
    const ratio = this.mathService.round(textureSize.width / textureSize.height, 2);
    const height = rect.dimensions.height;
    const width = this.mathService.round(height * ratio);
    const offset = this.mathService.round(Math.abs(width - rect.dimensions.width) / 2);

    //  if (isSetCoordinates) {
    sprite.x = rect.coordinates.x - offset;
    sprite.y = rect.coordinates.y;
    //  }

    sprite.width = width;
    sprite.height = height;

    this.objectOffsets.set(aid, offset);
  }

  private getObject<T extends DisplayObject>(aid: string): T | null {
    return this.app.stage.getChildByName<T>(aid);
  }
}
