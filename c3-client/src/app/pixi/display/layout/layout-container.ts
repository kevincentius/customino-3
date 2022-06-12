import { LayoutChild as LayoutNode } from "app/pixi/display/layout/layout-child";
import { Container } from "pixi.js";

export class LayoutContainer extends Container implements LayoutNode {
  nodes: LayoutNode[] = [];

  // 0 = row, 1 = column
  constructor(
    private axis=0,
    public layoutWidth=0,
    public layoutHeight=0,
    private gap=0,
  ) {
    super();
  }

  addNode(node: LayoutNode) {
    this.nodes.push(node);
    this.addChild(node);
  }

  removeNode(node: LayoutNode) {
    this.removeChild(node);
    this.nodes.splice(this.nodes.findIndex(n => n == node), 1);
  }

  updateLayout() {
    this.nodes.forEach(node => node.updateLayout ? node.updateLayout() : undefined);
    
    let pos = 0;
    for (let node of this.nodes) {
      if (this.axis == 0) {
        node.position.x = pos;
        pos += node.layoutWidth;
      } else {
        node.position.y = pos;
        pos += node.layoutHeight;
      }

      pos += this.gap;
    }

    if (this.axis == 0) {
      this.layoutWidth = pos - this.gap;
    } else {
      this.layoutHeight = pos - this.gap;
    }
  }
}
