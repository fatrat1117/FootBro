import { Component } from "@angular/core";
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-league-info',
  templateUrl: 'league-info.html'
})
export class LeagueInfoPage {
  constructor(private viewCtrl: ViewController, navParams: NavParams) {
  }

}
