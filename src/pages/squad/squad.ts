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
  players = [];
  constructor() {
    this.players.push({ left: 0, top: 0, photo: 'assets/img/none.png', name:'lihao' });
    this.players.push({ left: 100, top: 100, photo: 'assets/img/none.png', name: 'wang tianyi' });
    this.players.push({ left: 200, top: 200, photo: 'assets/img/none.png', name: 'li ji xiang' });
  }

  onTouchMove(e, p) {
    console.log(e);
    if (1 === e.touches.length) {
      p.left = e.touches[0].pageX - 24;// - this.left;
      p.top = e.touches[0].pageY - 24;
    }
  }

  panEvent(e, p) {
    //console.log(e);
    if (e.isFinal === false) {
      p.left = e.center.x - 24;// - this.left;
      p.top = e.center.y - 24;
    }
    //this.style.top = e.deltaY - this.top;
    //this.style.left = e.deltaX - this.left;
    //this.style.top = e.deltaY - this.top;
    //console.log(e, this.style);
    //this.pan++
  }
}
