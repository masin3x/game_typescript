import { Game } from "./game/Game";

const container = document.getElementById("gameContainer");

if (container) {
  const game = new Game(container, {
    width: container.clientWidth,
    height: container.clientHeight,
  });

  game.init();
}
