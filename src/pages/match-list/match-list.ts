import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Match } from '../../app/matches/match.model'
import { MatchService } from '../../app/matches/match.service'
import { NewGamePage } from "../new-game/new-game";
import { LeagueInfoPage } from "../league-info/league-info";
import * as moment from 'moment';

@Component({
  selector: 'page-match-list',
  templateUrl: 'match-list.html'
})

export class MatchListPage {

  constructor(public navCtrl: NavController, private matchService: MatchService) {
  }

  ionViewDidLoad() {
  }

  goLeaguePage() {
    this.navCtrl.push(LeagueInfoPage);
  }
}
