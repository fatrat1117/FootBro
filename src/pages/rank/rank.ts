import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RankService } from '../../app/rank/shared/rank.service'
import { MyPlayerPage } from '../my-player/my-player'
import { MyTeamPage } from '../my-team/my-team'

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
  numOfTeam = 0;
  teamScroll;
  constructor(public nav: NavController,
    private rankService: RankService) {

  }

  ionViewDidLoad() {
    document.addEventListener('TeamRankChanged', e => {
      this.teamRanks = this.rankService.teamRanks;
      this.numOfTeam = this.teamRanks.length;
      if (this.teamScroll)
        this.teamScroll.complete();
    });
    this.rankService.getTeamRankAsync(this.teamSortByStr, this.numOfTeam + 10);
  }

  sortTeamBy(str) {
    this.teamSortByStr = str;
    this.rankService.getTeamRankAsync(this.teamSortByStr, this.numOfTeam);
  }

  sortPlayerBy(str) {
    this.playerSortByStr = str;
    this.playerRanks.sort((a, b) => {
      return b.popularity - a.popularity;
    })
  }

  moreTeam(infiniteScroll) {
    console.log('more team available');
    this.teamScroll = infiniteScroll;
    this.rankService.getTeamRankAsync(this.teamSortByStr, this.numOfTeam + 10);
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

  goTeamPage(tId) {
    this.nav.push(MyTeamPage, { id: tId });
  } 
}
