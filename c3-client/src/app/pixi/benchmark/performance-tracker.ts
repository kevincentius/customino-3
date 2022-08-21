import { RunningTracker } from "app/pixi/benchmark/running-tracker";
import { RunningTrackerDisplay } from "app/pixi/benchmark/running-tracker-display";
import { Container } from "pixi.js";

export class PerformanceTracker extends Container {
  arrSize = 100;
  fpsTracker = new RunningTracker(this.arrSize);
  renderTracker = new RunningTracker(this.arrSize);
  logicTracker = new RunningTracker(this.arrSize);
  drawCountTracker = new RunningTracker(this.arrSize);

  fpsTrackerDisplay = new RunningTrackerDisplay(this.fpsTracker, 'mspf');
  renderTrackerDisplay = new RunningTrackerDisplay(this.fpsTracker, 'render');
  logicTrackerDisplay = new RunningTrackerDisplay(this.logicTracker, 'update');
  drawCountTrackerDisplay = new RunningTrackerDisplay(this.drawCountTracker, 'draw');

  constructor() {
    super();

    this.addChild(this.fpsTrackerDisplay);
    
    this.addChild(this.renderTrackerDisplay);
    this.renderTrackerDisplay.position.y = 40;

    this.addChild(this.logicTrackerDisplay);
    this.logicTrackerDisplay.position.y = 80;

    this.addChild(this.drawCountTrackerDisplay);
    this.drawCountTrackerDisplay.position.y = 120;
  }

  tick(dt: number, renderTickDuration: number, logicTickDuration: number, drawCount: number) {
    this.fpsTracker.next(dt);
    this.renderTracker.next(renderTickDuration);
    this.logicTracker.next(logicTickDuration);
    this.drawCountTracker.next(drawCount);

    this.fpsTrackerDisplay.tick();
    this.renderTrackerDisplay.tick();
    this.logicTrackerDisplay.tick();
    this.drawCountTrackerDisplay.tick();
  }

  override destroy() {
    this.fpsTrackerDisplay.destroy();
    this.renderTrackerDisplay.destroy();
    this.logicTrackerDisplay.destroy();
    this.drawCountTrackerDisplay.destroy();

    super.destroy();
  }
}
