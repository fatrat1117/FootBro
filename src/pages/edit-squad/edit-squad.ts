import { Component, ViewChild } from "@angular/core";
import { ViewController, NavParams } from 'ionic-angular';
import { Match } from '../../app/matches/match.model'

declare var google: any;

@Component({
  selector: 'page-edit-squad',
  templateUrl: 'edit-squad.html'
})
export class EditSquadPage {
  @ViewChild('pageHeader') pageHeader;
  match: Match;
  squadSettings: any;

  constructor(private viewCtrl: ViewController,
    navParams: NavParams) {
    this.match = navParams.get('match');
    //this.settings.offsetX = 32;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  openHere() {
    alert("here");
  }

  openDelete() {
    alert("delete");
  }

  ionViewDidLoad() {
    this.squadSettings = {};
    this.squadSettings.editMode = true;
    this.squadSettings.matchId = this.match.id;
    this.squadSettings.teamId = this.match.homeId;
    this.squadSettings.offsetY = this.pageHeader.nativeElement.clientHeight;
  }
 }
