import { Container, Loader, LoaderResource, Renderer, RENDERER_TYPE, SCALE_MODES, settings } from "pixi.js";

import { Keyboard } from "app/control/keyboard";
import { GameDisplay } from "app/pixi/display/game-display";
import { UserSettingsService } from "app/service/user-settings/user-settings.service";
import { ControlSettings } from "app/service/user-settings/control-settings";
import { ClientGame } from "@shared/game/engine/game/client-game";
import { PerformanceTracker } from "app/pixi/benchmark/performance-tracker";

export let resources: Partial<Record<string, LoaderResource>>;

export class PixiApplication {
  // app!: Application;

  loaded = false;

  game?: ClientGame;

  gameDisplay?: GameDisplay;

  keyboard: Keyboard = new Keyboard();

  performanceTracker = new PerformanceTracker();
  showPerformance = false;
  
  drawCount = 0;

  renderer: Renderer;
  stage = new Container();
  lastTick = Date.now();

  constructor(
    private canvas: HTMLCanvasElement,
    private userSettingsService: UserSettingsService,
  ) {
    settings.SCALE_MODE = SCALE_MODES.NEAREST;

    this.renderer = this.createRenderer();
    
    this.loadResources();

    this.userSettingsService.settingsChangedSubject.subscribe(localSettings => this.updateKeyBindings(localSettings.control));

    window.onresize = () => this.onResize();
    this.onResize();

    if (this.renderer.type == RENDERER_TYPE.WEBGL){
      console.log('Rendering with WebGL');
    } else if (this.renderer.type == RENDERER_TYPE.CANVAS) {
      console.warn('Rendering with Canvas! Performance will be bad!');
    } else {
      console.warn('Rendering with unknown renderer type!')
    }
    
    this.startMainLoop();
  }

  private createRenderer(): Renderer {
    const renderer = new Renderer({
      antialias: false,
      backgroundAlpha: 1,
      clearBeforeRender: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
      resolution: 1,
      autoDensity: true,
      useContextAlpha: true,

      width: 800,
      height: 600,
      // backgroundColor: 0x1099bb,
      view: this.canvas,
    });
    
    const drawElements = renderer.gl.drawElements;
    renderer.gl.drawElements = (mode, count, type, offset) => {
      drawElements.call(renderer.gl, mode, count, type, offset);
      this.drawCount++;
    }; // rewrite drawElements to count draws
    
    return renderer;
  }

  startMainLoop() {
    requestAnimationFrame(this.mainLoop.bind(this));
  }

  private mainLoop() {
    const ct = Date.now();
    const dt = ct - this.lastTick;
    this.lastTick = ct;	

    let microSecs = window.performance.now();
    if (this.gameDisplay) {
      this.gameDisplay.tick(dt);
      this.keyboard.tick(dt);
    }
    const logicTickDuration = (window.performance.now() - microSecs) / 1000;

    microSecs = window.performance.now();
    this.renderer.render(this.stage);
    const renderTickDuration = (window.performance.now() - microSecs) / 1000;
    
    this.performanceTracker.tick(dt, renderTickDuration, logicTickDuration, this.drawCount);
    this.drawCount = 0;

    requestAnimationFrame(this.mainLoop.bind(this));
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
      .add('gameSpritesheet', 'assets/spritesheet/game/normal/texture.json')
      .add('gameSpritesheetSmall', 'assets/spritesheet/game/small/texture.json')
      .load((loader, res) => {
        resources = res;

        this.loaded = true;
      });
  }

  bindGame(game: ClientGame) {
    this.game = game;

    this.game.destroySubject.subscribe(() => {
      if (this.gameDisplay) {
        this.stage.removeChild(this.gameDisplay);
        this.gameDisplay.destroy();
        this.gameDisplay = undefined;
      }
    });

    if (this.gameDisplay) {
      this.stage.removeChild(this.gameDisplay);
      this.gameDisplay.destroy();
    }
    this.gameDisplay = new GameDisplay(game);
    this.stage.addChild(this.gameDisplay);
    
    // bring to front
    if (this.showPerformance) {
      this.stage.removeChild(this.performanceTracker);
      this.stage.addChild(this.performanceTracker);
    }

    this.onResize();
  }

  togglePerformanceDisplay() {
    this.showPerformance = !this.showPerformance;
    if (this.showPerformance) {
      this.stage.addChild(this.performanceTracker);
    } else {
      this.stage.removeChild(this.performanceTracker);
    }
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.resize(width, height);

    if (this.gameDisplay) {
      this.gameDisplay.resize(width, height);
    }
  }

  destroy() {
    this.gameDisplay?.destroy();
    this.performanceTracker.destroy();
    this.renderer.destroy();
    this.stage.destroy();
  }
}
