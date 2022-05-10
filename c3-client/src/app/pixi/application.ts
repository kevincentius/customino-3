import { Application, BitmapText, Graphics, Loader, Sprite } from "pixi.js";

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
    .load((loader, resources) => {
      // this callback function is optional
      // it is called once all resources have loaded.
      // similar to onComplete, but triggered after
      console.log('All elements loaded!');
      
      this.loaded = true;
    
      // create new sprite from loaded resource
      const resource = resources['sample']!;
      const sprite = new Sprite(resource.texture);

      // set in a different position
      sprite.position.set(200, 300);

      // add the sprite to the stage
      this.app.stage.addChild(sprite);
    });


  }
}
