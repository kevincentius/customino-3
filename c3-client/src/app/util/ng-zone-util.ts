import { NgZone } from "@angular/core";

export function timeoutWrapper(ngZone: NgZone) {
  return (callback: () => any, ms?: number) => ngZone.runOutsideAngular(() => setTimeout(callback, ms));
}
