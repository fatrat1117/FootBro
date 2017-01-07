import {Component} from '@angular/core';
import {NavController} from 'ionic-angular'

@Component({
  selector: 'page-my-player',
  templateUrl: 'my-player.html',
})
export class MyPlayerPage {
  pId: any;
  //af
  NumOfLikes : number;
  NumOfUnLikes : number;
  PercentOfLikes : number;
  PercentOfUnLikes : number;

  constructor(private nav: NavController) {
    var fromDBLikes = 213;
    var fromDBUnLikes = 67;


    this.NumOfLikes = fromDBLikes;
    this.NumOfUnLikes = fromDBUnLikes;
    this.PercentOfLikes = fromDBLikes/(fromDBLikes+fromDBUnLikes) * 100;
    this.PercentOfUnLikes = fromDBUnLikes/ (fromDBLikes+fromDBUnLikes) * 100;

  }

}
