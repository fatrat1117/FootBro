import { Component } from "@angular/core";
import { ViewController, NavParams } from 'ionic-angular';

import { Team } from '../../app/teams/team.model'
import { TeamService } from '../../app/teams/team.service'


@Component({
  selector: 'page-league-info',
  templateUrl: 'league-info.html'
})
export class LeagueInfoPage {
  teams: Team[];
  constructor(private viewCtrl: ViewController, navParams: NavParams) {
    // dummy data
    this.teams = [];
    for (let i = 0; i < 10; ++i) {
      let t = new Team();
      t.name = i;
      this.teams.push(t);
    }
  }

}
