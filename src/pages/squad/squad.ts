import { Component } from '@angular/core';

@Component({
  selector: 'page-squad',
  templateUrl: 'squad.html',
})
export class SquadPage {
  public press: number = 0;
  public pan: number = 0;
  public swipe: number = 0;
  public tap: number = 0;
  style: any = {};
  constructor() {
    this.style.left = '0px';
    this.style.right = '0px';
    this.style.width = '48px';
    this.style.height = '48px';
    this.style.position = 'absolute';
  }
  pressEvent(e) {
    this.press++
  }
  panEvent(e) {
    this.style.left = e.center.x + e.deltaX + 'px';
    this.style.top = e.center.y + e.deltaY + 'px';
    console.log(e, this.style);
    this.pan++
  }
  swipeEvent(e) {
    this.swipe++
  }
  tapEvent(e) {
    this.tap++
  }

  getCircleBkColor(result) {
    let style: any = {};
    switch (result) {
      case 'W':
        style.background = '#00ff00';
        break;
      case 'L':
        style.background = '#8c8c8c';
        break;
      default:
        style.background = '#01c5ff';
        break;
    }
    return style;
  }
}
