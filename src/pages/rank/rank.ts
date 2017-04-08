import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RankService } from '../../app/rank/rank.service'
import { MyPlayerPage } from '../my-player/my-player'
import { MyTeamPage } from '../my-team/my-team'

@Component({
  selector: 'page-rank',
  templateUrl: 'rank.html'
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
  onTeamRanksChanged;
  onPlayerRanksChanged;

  constructor(public nav: NavController,
    private rankService: RankService) {

  }

  ionViewDidLoad() {
    this.onTeamRanksChanged = e => {
      this.teamRanks = this.rankService.teamRanks;
      this.numOfTeams = this.teamRanks.length;
      setTimeout(() => {
        if (this.teamScroll)
          this.teamScroll.complete();
      }, 500);
    };

    this.onPlayerRanksChanged = e => {
      this.playerRanks = this.rankService.playerRanks;
      this.numOfPlayers = this.playerRanks.length;
      setTimeout(() => {
        if (this.playerScroll)
          this.playerScroll.complete();
      }, 500);
    };

    document.addEventListener('serviceteamrankschanged', this.onTeamRanksChanged);
    document.addEventListener('serviceplayerrankschanged', this.onPlayerRanksChanged);

    this.rankService.getTeamRanksAsync(this.teamSortByStr, this.numOfTeams + 10);
    this.rankService.getPlayerRanksAsync(this.playerSortByStr, this.numOfPlayers + 20);
  }

  ionViewWillUnload() {
    document.removeEventListener('serviceteamrankschanged', this.onTeamRanksChanged);
    document.removeEventListener('serviceplayerrankschanged', this.onPlayerRanksChanged);
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

  goPlayerPage(pId) {
    //console.log(pId);
    this.nav.push(MyPlayerPage, { id: pId });
  }

  goTeamPage(tId) {
    this.nav.push(MyTeamPage, { id: tId });
  }
}
