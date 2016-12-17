import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MatchBasic } from '../../app/matches/shared/match.model'
import { MatchStanding } from '../../app/matches/shared/match.model'
import { MatchService } from '../../app/matches/shared/match.service'


@Component({
  selector: 'page-matches',
  templateUrl: 'matches.html',
  providers: [MatchService]
})

export class MatchesPage {
  matchesInfo: string;
  dates: number[];
  selectedDate: number;
  matchBasics: MatchBasic[];
  matchStandings: MatchStanding[];

  constructor(public navCtrl: NavController, private matchService: MatchService) {
    this.matchesInfo = "schedule"
  }

  ionViewDidLoad() {
    this.matchService.getMatchDates("test_league_id").then(dates => {
      this.dates = dates;
    });

    this.matchService.getMatchBasics("test_date").then(matchBasics => {
      this.matchBasics = matchBasics;
    });

    this.matchService.getMatchStandings("test_league_id").then(matchStandings => {
      this.matchStandings = matchStandings;
    });

  }

  showMatches(date, index) {
    this.selectedDate = date;
  }
}