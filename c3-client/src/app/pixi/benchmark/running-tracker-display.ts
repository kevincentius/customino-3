import { RunningTracker } from "app/pixi/benchmark/running-tracker";
import { textUtil } from "app/pixi/util/text-util";
import { Container } from "pixi.js";

export class RunningTrackerDisplay extends Container {
  avgText = textUtil.create('fps: 40');
  maxText = textUtil.create('max: 40');

  constructor(
    private tracker: RunningTracker,
    private propName: string,
  ) {
    super();
    this.addChild(this.avgText);
    this.addChild(this.maxText);
    
    this.maxText.position.y = 20;
  }

  tick() {
    this.avgText.text = this.propName + ': ' + this.tracker.avg.toFixed(3);
    this.maxText.text = 'max: ' + this.tracker.max.toFixed(3);
  }
}
