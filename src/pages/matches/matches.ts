import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { MatchBasic } from '../../app/matches/shared/match.model'
import { MatchStanding } from '../../app/matches/match.model'
import { MatchService } from '../../app/matches/match.service'
import { NewGamePage } from "../new-game/new-game";
import * as moment from 'moment';

@Component({
  selector: 'page-matches',
  templateUrl: 'matches.html'
})

export class MatchesPage {
  dates: number[];
  selectedDate: number;
  matches;
  matchStandings: MatchStanding[];
  today;
  selectedInfo: string;
  selectedId: string;
  tournamentId;
  afTournamentList;

  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private matchService: MatchService) {
    this.selectedInfo = "schedule";
    this.selectedId = "0";
    this.afTournamentList = this.matchService.afTournamentList();
  }

  ionViewDidLoad() {
    this.today = moment(moment().format("YYYY-MM-DD")).unix() * 1000;
    this.addEventListeners();
    this.matchService.getMatchDatesAsync("all");

    this.matchService.getMatchStandings("test_league_id").then(matchStandings => {
      this.matchStandings = matchStandings;
    });
  }

  scrollToToday() {
    let iToday = -1;
    if (this.dates.length > 0)
      iToday = 0;
    for (let i = 1; i < this.dates.length; ++i) {
      if (Number(this.dates[i]) > this.today) {
        break;
      }
      iToday = i;
    }

    if (iToday != -1) {
      let closeToToday = this.dates[iToday];
      this.showMatches(closeToToday, iToday);
      let scrollableDiv = document.getElementById("sketchElement");

      if (scrollableDiv) {
        scrollableDiv.scrollTop = 0;
        let scrollableItem = scrollableDiv.getElementsByTagName("ion-item");

        if (scrollableItem.length > 0) {
          scrollableDiv.scrollTop += scrollableItem[0].clientHeight * iToday;
        }
      }
    }
  }

  addEventListeners() {
    document.addEventListener('matchdatesready', e => {
      let id = e['detail'];
      this.dates = this.matchService.getMatchDates(id);
      if (!this.selectedDate) {
        let self = this;
        setTimeout(() => {
          self.scrollToToday()
        },
          1000);
      }
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

  enterNewGame() {
    this.modalCtrl.create(NewGamePage, { tournamentId: this.tournamentId }).present();
  }
}
