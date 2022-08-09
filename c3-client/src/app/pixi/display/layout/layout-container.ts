import { LayoutAlignment } from "app/pixi/display/layout/layout-alignment";
import { LayoutChild as LayoutNode } from "app/pixi/display/layout/layout-child";
import { Container, Graphics } from "pixi.js";

export class LayoutContainer extends Container implements LayoutNode {
  nodes: LayoutNode[] = [];

  layoutWidth: number;
  layoutHeight: number;

  debug = false;
  debugRect?: Graphics;

  // 0 = row, 1 = column
  constructor(
    private axis=0,
    public forceLayoutWidth: number | null=null,
    public forceLayoutHeight: number | null=null,
    private gap=0,
    private alignment=LayoutAlignment.START,
  ) {
    super();

    this.layoutWidth = forceLayoutWidth ?? 0;
    this.layoutHeight = forceLayoutHeight ?? 0;

    if (this.debug) {
      this.debugRect = new Graphics();
      this.addChild(this.debugRect);
    }
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

    // justify
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

      // align
      for (let node of this.nodes) {
        node.position.y = this.align(maxBreadth, node.layoutHeight);
      }
    } else {
      if (this.forceLayoutHeight == null) {
        this.layoutHeight = pos - this.gap;
      }

      if (this.forceLayoutWidth == null) {
        this.layoutWidth = maxBreadth;
      }

      // align
      for (let node of this.nodes) {
        node.position.x = this.align(maxBreadth, node.layoutWidth);
      }
    }

    if (this.debug) {
      this.debugRect!
        .clear()
        .lineStyle({
          width: 1,
          color: 0x00ff00,
          alpha: 0.5,
        })
        .drawRect(0, 0, this.layoutWidth, this.layoutHeight);
    }
  }

  private align(maxBreadth: number, nodeBreadth: number) {
    if (this.alignment == LayoutAlignment.START) {
      return 0;
    } else if (this.alignment == LayoutAlignment.MIDDLE) {
      return (maxBreadth - nodeBreadth) / 2;
    } else if (this.alignment == LayoutAlignment.END) {
      return maxBreadth - nodeBreadth;
    } else {
      throw new Error();
    }
  }
  
  override destroy() {
    if (this.debug) {
      this.debugRect!.destroy();
    }

    super.destroy();
  }
}
