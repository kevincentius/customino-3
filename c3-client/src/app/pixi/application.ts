import { Application, Loader, LoaderResource, SCALE_MODES, settings } from "pixi.js";

import { Keyboard } from "app/control/keyboard";
import { GameDisplay } from "app/pixi/display/game-display";
import { UserSettingsService } from "app/service/user-settings/user-settings.service";
import { ControlSettings } from "app/service/user-settings/control-settings";
import { ClientGame } from "@shared/game/engine/game/client-game";
import { RunningTracker } from "app/pixi/benchmark/running-tracker";
import { PerformanceTracker } from "app/pixi/benchmark/performance-tracker";

export let resources: Partial<Record<string, LoaderResource>>;

export class PixiApplication {
  app!: Application;

  loaded = false;

  game?: ClientGame;

  gameDisplay?: GameDisplay;

  keyboard: Keyboard = new Keyboard();

  performanceTracker = new PerformanceTracker();
  showPerformance = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private userSettingsService: UserSettingsService,
  ) {
    settings.SCALE_MODE = SCALE_MODES.NEAREST;

    this.app = new Application({
      view: this.canvas,
      // resizeTo: window,
      backgroundColor: 0x000022,

      antialias: true,
      autoDensity: true, // !!!
      resolution: 1,
    });

    this.loadResources();

    this.app.ticker.add(() => {
      let dt = this.app.ticker.deltaMS;

      const microSecs = window.performance.now();
      if (this.gameDisplay) {
        this.gameDisplay.tick(dt);
        this.keyboard.tick(dt);
      }
      const logicTickDuration = (window.performance.now() - microSecs) / 1000;
      this.performanceTracker.tick(dt, logicTickDuration);
    });

    this.userSettingsService.settingsChangedSubject.subscribe(localSettings => this.updateKeyBindings(localSettings.control));

    window.onresize = () => this.onResize();
    this.onResize();
  }

  public updateKeyBindings(c: ControlSettings) {
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

  bindGame(game: ClientGame) {
    this.game = game;

    this.game.destroySubject.subscribe(() => {
      if (this.gameDisplay) {
        this.app.stage.removeChild(this.gameDisplay);
        this.gameDisplay = undefined;
      }
    });

    if (this.gameDisplay) {
      this.app.stage.removeChild(this.gameDisplay);
    }
    this.gameDisplay = new GameDisplay(game);
    this.app.stage.addChild(this.gameDisplay);
    
    // bring to front
    if (this.showPerformance) {
      this.app.stage.removeChild(this.performanceTracker);
      this.app.stage.addChild(this.performanceTracker);
    }

    this.onResize();
  }

  togglePerformanceDisplay() {
    this.showPerformance = !this.showPerformance;
    if (this.showPerformance) {
      this.app.stage.addChild(this.performanceTracker);
    } else {
      this.app.stage.removeChild(this.performanceTracker);
    }
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.app.renderer.resize(width, height);

    if (this.gameDisplay) {
      this.gameDisplay.resize(width, height);
    }
  }
}
