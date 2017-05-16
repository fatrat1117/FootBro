import { Component } from '@angular/core';
import { NavController ,ModalController } from 'ionic-angular';
import { Match } from '../../app/matches/match.model'
import { MatchesPage } from '../matches/matches';
import { LeagueInfoPage } from "../league-info/league-info";
import { LeagueResultPage } from "../league-result/league-result";
import * as moment from 'moment';

import { PlayerService } from '../../app/players/player.service'
import { MatchService } from '../../app/matches/match.service'


import { GameSchedulePage } from "../game-schedule/game-schedule"



@Component({
  selector: 'page-match-list',
  templateUrl: 'match-list.html'
})

export class MatchListPage {
  tournaments = [];
  onTounamentsReady;
  //afTournamentList

  constructor(public navCtrl: NavController, private modal: ModalController, private playerService: PlayerService, private matchService: MatchService) {
  }

  ionViewDidLoad() {
    this.onTounamentsReady = () => {
      this.tournaments = this.matchService.getTournaments();
    }

    document.addEventListener('tournamentsready', this.onTounamentsReady);
    this.matchService.getTournamentsAsync();
    //this.afTournamentList = this.matchService.afTournamentList();
  }

  ionViewWillUnload() {
    document.removeEventListener('tournamentsready', this.onTounamentsReady);
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

  leagueClick(league) {
    if (league.status == 'prepare') {
      this.goLeagueInfoPage(league);
    }
    else {
      this.navCtrl.push(MatchesPage, {
        tournament: league,
        tournamentId: league.$key,
        status: league.status,
        rules: league.rules,
        type: league.type,
      })
    }
  }

  enterCup() {
    this.navCtrl.push(GameSchedulePage);
  }
}
