import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TeamRankService } from '../../app/teams/shared/team-rank.service'

@Component({
  selector: 'page-rank',
  templateUrl: 'rank.html',
  providers: [TeamRankService]
})
export class RankPage {
  stats = "teams";
  teamSortByStr = "ability";
  teamRanks;
  constructor(public navCtrl: NavController,
    private rankService: TeamRankService) {

  }

  ionViewDidLoad() {
    this.rankService.getTeamRanks().then(teamRanks => {
      console.log(teamRanks);
      this.teamRanks = teamRanks;
    })
  }

  sortTeamBy(str) {
    this.teamSortByStr = str;
    //this.teamSortBy.next(this.teamSortByStr);
  }
}
