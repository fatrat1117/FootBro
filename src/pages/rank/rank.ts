import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {RankService} from './rank.service'

@Component({
  selector: 'page-rank',
  templateUrl: 'rank.html',
  providers: [RankService]
})
export class RankPage {
  stats = "teams";
  teamSortByStr = "ability";
  teamRanks;
  constructor(public navCtrl: NavController,
  private rankService : RankService) {

  }

  ionViewDidLoad() {
    this.teamRanks = this.rankService.getTeamRanks().then(teamRanks => {
      console.log(teamRanks);
      this.teamRanks = teamRanks;
    })
  }

  sortTeamBy(str) {
    this.teamSortByStr = str;
    //this.teamSortBy.next(this.teamSortByStr);
  }
}
