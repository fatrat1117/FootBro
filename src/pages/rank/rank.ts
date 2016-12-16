import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TeamPublicService } from '../../app/public/shared/team-public.service'

@Component({
  selector: 'page-rank',
  templateUrl: 'rank.html',
  providers: [TeamPublicService]
})
export class RankPage {
  stats = "teams";
  teamSortByStr = "ability";
  teamRanks;
  constructor(public navCtrl: NavController,
    private rankService: TeamPublicService) {

  }

  ionViewDidLoad() {
    this.rankService.getTeamPublics().then(teamRanks => {
      //console.log(teamRanks);
      this.teamRanks = teamRanks;
      this.sortTeamBy(this.teamSortByStr);
    });
  }

  sortTeamBy(str) {
    this.teamSortByStr = str;
    this.teamRanks.sort((a, b)=> {
      if ("ability" === this.teamSortByStr)
        return b.ability - a.ability;
      else 
        return b.popularity - a.popularity;
    });
    //this.teamSortBy.next(this.teamSortByStr);
  }

  moreTeam(infiniteScroll) {
    console.log('more team available');
    setTimeout(() => {
      this.rankService.getMoreTeamRanks().then(teamRanks => {
        console.log('loading team finished');
        //console.log(teamRanks);  
        //this.sortTeamBy(this.teamSortByStr);
        infiniteScroll.complete();
      });
    }, 500);
  }
}
