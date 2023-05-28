import { Game } from "./game/Game";
import { Container } from "./game/core/Container";
import { GraphicsEngineTypes } from "./game/graphics/engine/enum/GraphicsEngineTypes";

const container = document.getElementById("gameContainer");

if (container) {
  const game = new Game(
    container,
    {
      width: container.clientWidth,
      height: container.clientHeight,
    },
    {
      graphicsEngineType: GraphicsEngineTypes.WEBGL,
      isDrawRect: false,
    },
    {}
  );

  game.init();
}
