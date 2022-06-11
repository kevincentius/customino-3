import { Application, Loader, LoaderResource } from "pixi.js";

import { Keyboard } from "app/control/keyboard";
import { InputKey } from "@shared/game/network/model/input-key";
import { Game } from "@shared/game/engine/game/game";
import { GameDisplay } from "app/pixi/display/game-display";

export let resources: Partial<Record<string, LoaderResource>>;

export class PixiApplication {
  app!: Application;

  loaded = false;

  game?: Game;

  gameDisplay!: GameDisplay;

  keyboard: Keyboard = new Keyboard();

  constructor(private canvas: HTMLCanvasElement) {
    this.app = new Application({
      view: this.canvas,
      resizeTo: window,
      backgroundColor: 0x111111,
    });

    this.loadResources();
    this.initKeyboard();

    this.app.ticker.add(() => {
      let dt = this.app.ticker.deltaMS;

      if (this.gameDisplay) {
        this.gameDisplay.tick(dt);
        this.keyboard.tick(dt);
      }
    });
  }

  private initKeyboard() {
    this.keyboard.bind(InputKey.LEFT, 'KeyJ');
    this.keyboard.bind(InputKey.RIGHT, 'KeyK');
    this.keyboard.bind(InputKey.SOFT_DROP, 'Space');
    this.keyboard.bind(InputKey.RCCW, 'KeyD');
    this.keyboard.bind(InputKey.RCW, 'KeyL');
    this.keyboard.bind(InputKey.R180, 'KeyS');
    this.keyboard.bind(InputKey.HARD_DROP, 'KeyF');
  }

  private loadResources() {
    const loader = Loader.shared;

    loader
      .add('sample', 'assets/img/sample.png')
      .add('gameSpritesheet', 'assets/spritesheet/game/texture.json')
      .load((loader, res) => {
        resources = res;

        this.loaded = true;
      });
  }

  bindGame(game: Game) {
    this.game = game;

    if (this.gameDisplay) {
      this.app.stage.removeChild(this.gameDisplay);
    }
    this.gameDisplay = new GameDisplay(game);
    this.app.stage.addChild(this.gameDisplay);
  }
}
