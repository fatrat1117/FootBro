import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-rank',
  templateUrl: 'rank.html'
})
export class RankPage {
  stats = "teams";
  teamSortByStr = "ability";
  constructor(public navCtrl: NavController) {

  }

  sortTeamBy(str) {
    this.teamSortByStr = str;
    //this.teamSortBy.next(this.teamSortByStr);
  }
}
