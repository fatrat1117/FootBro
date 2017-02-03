import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { MatchBasic } from '../../app/matches/shared/match.model'
import { MatchStanding } from '../../app/matches/match.model'
import { MatchService } from '../../app/matches/match.service'

import { LeagueBasic } from '../../app/leagues/shared/league.model'
import { LeagueService } from '../../app/leagues/shared/league.service'
import { NewGamePage } from "../new-game/new-game";


@Component({
  selector: 'page-matches',
  templateUrl: 'matches.html',
  providers: [ MatchService, LeagueService ]
})

export class MatchesPage {
  dates: number[];
  selectedDate: number;
  matches;
  matchStandings: MatchStanding[];
  leagueBasics: LeagueBasic[];

  selectedInfo: string;
  selectedId: string;

  constructor(public navCtrl: NavController, private modalCtrl: ModalController, private matchService: MatchService, private leagueService: LeagueService) {
    this.selectedInfo = "schedule";
    this.selectedId = "0";
  }

  ionViewDidLoad() {
    this.addEventListeners();
    this.matchService.getMatchDatesAsync("all");

    this.matchService.getMatchStandings("test_league_id").then(matchStandings => {
      this.matchStandings = matchStandings;
    });

    this.leagueService.getLeagueBasics("test_league_id").then(leagueBasics => {
      this.leagueBasics = leagueBasics;
    });
  }

  addEventListeners() {
    document.addEventListener('matchdatesready', e=> {
      let id = e['detail'];
      this.dates = this.matchService.getMatchDates(id);
    });

    document.addEventListener('matchesbydateready', e => {
      let date = e['detail'];
      this.matches = this.matchService.getMatchesByDate(date);
    });
  }

  showMatches(date, index) {
    this.selectedDate = date;
    this.matchService.getMatchesByDateAsync(date);
  }

  onSelectionChange() {
    if (this.selectedId == "0")
      this.selectedInfo = "schedule";
  }

  enterNewGame(){
    this.modalCtrl.create(NewGamePage).present();
  }
}
