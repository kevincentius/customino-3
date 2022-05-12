import { SampleDisplay } from "app/pixi/display/sample-display";
import { Application, Loader, Sprite } from "pixi.js";

export let resources: Partial<Record<string, PIXI.LoaderResource>>;

export class PixiApplication {
  app!: Application;

  loaded = false;

  constructor(
    private canvas: HTMLCanvasElement
  ) {
    this.app = new Application({
      view: this.canvas,
      resizeTo: window,
    });

    const loader = Loader.shared;

    loader
    .add('sample', 'assets/img/sample.png')
    .load((loader, res) => {
      console.log('PIXI loader is finished!');

      resources = res;
      
      this.loaded = true;
    
      this.app.stage.addChild(new SampleDisplay());
    });
  }
}
