import { Application, Loader, LoaderResource } from "pixi.js";

import { Keyboard } from "app/control/keyboard";
import { InputKey } from "@shared/game/network/model/input-key";
import { Game } from "@shared/game/engine/game/game";
import { GameDisplay } from "app/pixi/display/game-display";
import { IdbService } from "app/service/idb.service";

export let resources: Partial<Record<string, LoaderResource>>;

export class PixiApplication {
  app!: Application;

  loaded = false;

  game?: Game;

  gameDisplay!: GameDisplay;

  keyboard: Keyboard = new Keyboard();

  constructor(private canvas: HTMLCanvasElement, private idbService: IdbService) {
    this.app = new Application({
      view: this.canvas,
      resizeTo: window,
      backgroundColor: 0x111111,
    });

    this.loadResources();

    this.app.ticker.add(() => {
      let dt = this.app.ticker.deltaMS;

      if (this.gameDisplay) {
        this.gameDisplay.tick(dt);
        this.keyboard.tick(dt);
      }
    });
  }

  public async updateKeyBindings() {
    const c = (await this.idbService.getControlSettings())!;
    this.keyboard.unbindAllKeys();
    c.keyMap.forEach((mappings, inputKey) => mappings.forEach(mapping => this.keyboard.bind(inputKey, mapping)));
    this.keyboard.das = c.das;
    this.keyboard.arr = c.arr;
    this.keyboard.sdr = c.sdr;
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
    this.updateKeyBindings();

    if (this.gameDisplay) {
      this.app.stage.removeChild(this.gameDisplay);
    }
    this.gameDisplay = new GameDisplay(game);
    this.app.stage.addChild(this.gameDisplay);
  }
}
