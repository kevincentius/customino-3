import { RunningTracker } from "app/pixi/benchmark/running-tracker";
import { RunningTrackerDisplay } from "app/pixi/benchmark/running-tracker-display";
import { Container } from "pixi.js";

export class PerformanceTracker extends Container {
  arrSize = 300;
  fpsTracker = new RunningTracker(this.arrSize);
  logicTracker = new RunningTracker(this.arrSize);

  fpsTrackerDisplay = new RunningTrackerDisplay(this.fpsTracker, 'mspf');
  logicTrackerDisplay = new RunningTrackerDisplay(this.logicTracker, 'update');

  constructor() {
    super();

    this.addChild(this.fpsTrackerDisplay);
    this.addChild(this.logicTrackerDisplay);
    this.logicTrackerDisplay.position.y = 40;
  }

  tick(dt: number, logicTickDuration: number) {
    this.fpsTracker.next(dt);
    this.logicTracker.next(logicTickDuration);

    this.fpsTrackerDisplay.tick();
    this.logicTrackerDisplay.tick();
  }
}
