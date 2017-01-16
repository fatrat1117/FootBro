import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RankService } from '../../app/rank/shared/rank.service'
import { MyPlayerPage } from '../my-player/my-player'

@Component({
  selector: 'page-rank',
  templateUrl: 'rank.html',
  providers: [RankService]
})
export class RankPage {
  stats = "teams";
  teamSortByStr = "ability";
  playerSortByStr = "popularity";
  teamRanks;
  playerRanks;
  constructor(public nav: NavController,
    private rankService: RankService) {

  }

  ionViewDidLoad() {
    this.rankService.getTeamPublicsSync(this.teamSortByStr, 20);
    // this.rankService.getTeamPublics();.then(teamRanks => {
    //   console.log(teamRanks);
    //   this.teamRanks = teamRanks;
    //   this.sortTeamBy(this.teamSortByStr);
    // });

    this.rankService.getPlayerRanks().then(ranks => {
      //console.log(teamRanks);
      this.playerRanks = ranks;
      this.sortPlayerBy(this.playerSortByStr);
    });
  }

  sortTeamBy(str) {
    this.teamSortByStr = str;
    this.teamRanks.sort((a, b) => {
      if ("ability" === this.teamSortByStr)
        return b.ability - a.ability;
      else
        return b.popularity - a.popularity;
    });
    //this.teamSortBy.next(this.teamSortByStr);
  }

  sortPlayerBy(str) {
    this.playerSortByStr = str;
    this.playerRanks.sort((a, b) => {
      return b.popularity - a.popularity;
    })
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

  morePlayer(infiniteScroll) {
    console.log('more player available');
    setTimeout(() => {
      this.rankService.getMorePlayerRanks().then(ranks => {
        console.log('loading player finished');
        infiniteScroll.complete();
      });
    }, 500);
  }

  goPlayerPage(id) {
    this.nav.push(MyPlayerPage, { pId: id });
  }
}
