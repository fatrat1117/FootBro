import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MatchBasic } from '../../app/matches/shared/match.model'
import { MatchStanding } from '../../app/matches/shared/match.model'
import { MatchService } from '../../app/matches/shared/match.service'

import { LeagueBasic } from '../../app/leagues/shared/league.model'
import { LeagueService } from '../../app/leagues/shared/league.service'


@Component({
  selector: 'page-matches',
  templateUrl: 'matches.html',
  providers: [MatchService, LeagueService]
})

export class MatchesPage {
  dates: number[];
  selectedDate: number;
  matchBasics: MatchBasic[];
  matchStandings: MatchStanding[];
  leagueBasics: LeagueBasic[];
  
  selectedInfo: string;
  selectedId: string;

  constructor(public navCtrl: NavController, private matchService: MatchService, private leagueService: LeagueService) {
    this.selectedInfo = "schedule";
    this.selectedId = "0";
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

    this.leagueService.getLeagueBasics("test_league_id").then(leagueBasics => {
      this.leagueBasics = leagueBasics;
    });
  }

  showMatches(date, index) {
    this.selectedDate = date;
  }

  onSelectionChange() {
    if (this.selectedId == "0")
      this.selectedInfo = "schedule";
  }
}