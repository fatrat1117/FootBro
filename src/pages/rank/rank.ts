import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RankService } from '../../app/rank/rank.service'
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
  numOfTeams = 0;
  teamScroll;
  numOfPlayers = 0;
  playerScroll;

  constructor(public nav: NavController,
    private rankService: RankService) {

  }

  ionViewDidLoad() {
    document.addEventListener('serviceteamrankschanged', e => {
      this.teamRanks = this.rankService.teamRanks;
      this.numOfTeams = this.teamRanks.length;
      if (this.teamScroll)
        this.teamScroll.complete();
    });

    document.addEventListener('serviceplayerrankschanged', e => {
      this.playerRanks = this.rankService.playerRanks;
      this.numOfPlayers = this.playerRanks.length;
      if (this.playerScroll)
         this.playerScroll.complete();
    });

    this.rankService.getTeamRanksAsync(this.teamSortByStr, this.numOfTeams + 10);
    this.rankService.getPlayerRanksAsync(this.playerSortByStr, this.numOfPlayers + 20);
  }

  sortTeamBy(str) {
    this.teamSortByStr = str;
    this.rankService.getTeamRanksAsync(this.teamSortByStr, this.numOfTeams);
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
    this.rankService.getTeamRanksAsync(this.teamSortByStr, this.numOfTeams + 10);
  }

  morePlayer(infiniteScroll) {
    console.log('more player available');
    this.playerScroll = infiniteScroll;
    this.rankService.getPlayerRanksAsync(this.playerSortByStr, this.numOfPlayers + 20);
  }

  goPlayerPage(id) {
    this.nav.push(MyPlayerPage, { pId: id });
  }

  goTeamPage(tId) {
    this.nav.push(MyTeamPage, { id: tId });
  } 
}
