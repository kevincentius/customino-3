import TetrisMove from "@shared/TetrisMove";
import { SampleDisplay } from "app/pixi/display/sample-display";
import { Application, Loader, Sprite } from "pixi.js";

import Keyboard from './Keyboard'

export let resources: Partial<Record<string, PIXI.LoaderResource>>;

export class PixiApplication {
  app!: Application;

  loaded = false;

  constructor(private canvas: HTMLCanvasElement) {
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

    const keyCode = (char: string)=>char.toUpperCase().charCodeAt(0);

    let a = new Keyboard;

    a.Enable();
    a.Bind(TetrisMove.Left, keyCode('A'));
    a.Bind(TetrisMove.Right, keyCode('D'));
    a.Bind(TetrisMove.SoftDrop, 12);
    a.Bind(TetrisMove.RCCW, 37);
    a.Bind(TetrisMove.RCW, 39);
    a.Bind(TetrisMove.Flip, 38);
    a.Bind(TetrisMove.HardDrop, 32);


    this.app.ticker.add(()=>{
      let dt = this.app.ticker.deltaMS;
      
      a.Update(dt);

      let out = a.GetOutput();
      if (out.length > 0){
        console.log(out);
      }

      a.Clear();
    });

    // // Main Loop
    // let time = Date.now();
    // let dt = 0;

    // function main(frameTime: number){
    //   // Calculate Delta Time
    //   dt = frameTime - time;
    //   time = frameTime;
      
    //   window.requestAnimationFrame(main);
    // }

    // main(0);


  
  }
}
