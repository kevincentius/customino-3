import { LayoutChild as LayoutNode } from "app/pixi/display/layout/layout-child";
import { Container } from "pixi.js";

export class LayoutContainer extends Container implements LayoutNode {
  nodes: LayoutNode[] = [];

  layoutWidth: number;
  layoutHeight: number;

  // 0 = row, 1 = column
  constructor(
    private axis=0,
    public forceLayoutWidth: number | null=null,
    public forceLayoutHeight: number | null=null,
    private gap=0,
  ) {
    super();

    this.layoutWidth = forceLayoutWidth ?? 0;
    this.layoutHeight = forceLayoutHeight ?? 0;
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
    let maxBreadth = 0;
    for (let node of this.nodes) {
      if (this.axis == 0) {
        node.position.x = pos;
        pos += node.layoutWidth;
        maxBreadth = Math.max(maxBreadth, node.layoutHeight);
      } else {
        node.position.y = pos;
        pos += node.layoutHeight;
        maxBreadth = Math.max(maxBreadth, node.layoutWidth);
      }

      pos += this.gap;
    }

    if (this.axis == 0) {
      if (this.forceLayoutWidth == null) {
        this.layoutWidth = pos - this.gap;
      }
      
      if (this.forceLayoutHeight == null) {
        this.layoutHeight = maxBreadth;
      }
    } else {
      if (this.forceLayoutHeight == null) {
        this.layoutHeight = pos - this.gap;
      }

      if (this.forceLayoutWidth == null) {
        this.layoutWidth = maxBreadth;
      }
    }
  }
}
