import { Component } from '@angular/core';
import { NavController ,ModalController } from 'ionic-angular';
import { Match } from '../../app/matches/match.model'
import { NewGamePage } from "../new-game/new-game";
import { MatchesPage } from '../matches/matches';
import { EditSquadPage } from '../edit-squad/edit-squad';
import { LeagueInfoPage } from "../league-info/league-info";
import { LeagueResultPage } from "../league-result/league-result";
import * as moment from 'moment';

import { PlayerService } from '../../app/players/player.service'
import { MatchService } from '../../app/matches/match.service'

@Component({
  selector: 'page-match-list',
  templateUrl: 'match-list.html'
})

export class MatchListPage {
  afTournamentList

  constructor(public navCtrl: NavController, private modal: ModalController, private playerService: PlayerService, private matchService: MatchService) {
  }

  ionViewDidLoad() {
    this.afTournamentList = this.matchService.afTournamentList();
  }

  goMatchesPage() {
    this.navCtrl.push(MatchesPage);
  }

  goLeagueInfoPage(league) {
    if (this.playerService.isAuthenticated()) {
      this.navCtrl.push(LeagueInfoPage, {
        league: league
      });
    }
    else
      this.playerService.checkLogin();
  }

  showLeagueResult(league) {
    this.navCtrl.push(LeagueResultPage, {
      league: league
    })
  }

  leagueClick(league) {
    if (league.status == 'prepare') {
      this.goLeagueInfoPage(league);
    }
    else {
      this.navCtrl.push(MatchesPage, {
        id: league.$key,
        status: league.status
      })
    }

  }
}
