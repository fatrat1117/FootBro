import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MatchBasic } from '../../app/matches/shared/match.model'
import { MatchService } from '../../app/matches/shared/match.service'

import { Localization } from '../../providers/localization';
import { StringToDatePipe, NumberToTimePipe } from '../../pipes/moment.pipe';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  providers: [MatchService]
})

export class SchedulePage {
  dates: any;
  matchBasics: MatchBasic[];
  selectedDate: number;

  constructor(public navCtrl: NavController, private matchService: MatchService) {

  }

  ionViewDidLoad() {
    this.matchService.getMatchDates("test_league_id").then(dates => {
      this.dates = dates;
    });

    this.matchService.getMatchBasics("test_date").then(matchBasics => {
      this.matchBasics = matchBasics;
    });

  }

  showMatches(date, index) {
    this.selectedDate = date;
  }
}