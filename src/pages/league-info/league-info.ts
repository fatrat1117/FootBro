import { Component } from "@angular/core";
import { ViewController, NavParams } from 'ionic-angular';

import { Team } from '../../app/teams/team.model'
import { TeamService } from '../../app/teams/team.service'
import {Localization} from '../../providers/localization';


@Component({
  selector: 'page-league-info',
  templateUrl: 'league-info.html'
})
export class LeagueInfoPage {
  teams: Team[];
  slides: Object[];
  leagueInfo = "info";
  numPerRow = 3;
  constructor(private viewCtrl: ViewController, navParams: NavParams,local: Localization) {
    // dummy data
    this.teams = [];
    for (let i = 0; i < 10; ++i) {
      let t = new Team();
      t.name = "宇宙第一超级无敌DDDDDDDDDDiao之巴塞罗那"+i;
      this.teams.push(t);
    }
    this.slides = [];
    this.loadSlides(local.langCode, 1);
  }

  loadSlides(langCode: string, total: number) {
    for (let i = 0; i < total; ++i) {
      this.slides.push({
        image: `assets/img/league-info/banners/${langCode}/${i}.jpg`
      });
    }
  }
  

}
