import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Match } from '../../app/matches/match.model'
import { NewGamePage } from "../new-game/new-game";
import { LeagueInfoPage } from "../league-info/league-info";
import * as moment from 'moment';

import { PlayerService } from '../../app/players/player.service'
import { MatchService } from '../../app/matches/match.service'

@Component({
  selector: 'page-match-list',
  templateUrl: 'match-list.html'
})

export class MatchListPage {

  constructor(public navCtrl: NavController, private playerService: PlayerService, private matchService: MatchService) {
  }

  ionViewDidLoad() {
  }

  goLeaguePage() {
    if (this.playerService.isAuthenticated()) {
      this.navCtrl.push(LeagueInfoPage);
    }
    else
      this.playerService.checkLogin();
  }
}
