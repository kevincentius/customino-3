
/*
 * Usage: *ngIf="dom", [class.hideMe]="state"
 * 
 * This class makes sure that the leave animation is played before removing the element from the DOM.
 */
export class EnterLeaveTransition {
  state = true;
  hiddenStyle = false;
  dom = true;
  timeout: any;

  constructor(
    private leaveAnimMs: number,
  ) {}

  setState(value: boolean) {
    if (this.state && !value) {
      // exit transition
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => this.dom = false, this.leaveAnimMs);
    }

    if (value) {
      this.dom = true;
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
    
    this.state = value;
    setTimeout(() => this.hiddenStyle = !this.state, 50);
  }
}
