import { Component } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';

import { NewTeamPage } from './new-team'

import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'


@Component({
  selector: 'page-manage-team',
  templateUrl: 'manage-team.html'
})
export class ManageTeamPage {
  player: Player;
  teams: string[];
  constructor(private viewCtrl: ViewController, private modalCtrl: ModalController, private playerService: PlayerService) {

  }

  ionViewDidLoad() {
    // this.playerService.getSelfBasic().then(playerBasic => {
    //   this.playerBasic = playerBasic;
    // })

    // this.playerService.getSelfTeams().then(teams => {
    //   this.teams = teams;
    // });
  }
  
  setDefaultTeam(index: number, slidingItem) {
    slidingItem.close();
    this.updateSelfBasic(this.teams[index]);
  }

  quitTeam(index: number) {
    // if is default team, clear it
    if (this.teams[index] == this.player.teamId)
      this.updateSelfBasic("");

    // remove from team list
    this.teams.splice(index, 1);
    //this.playerService.saveSelfTeams(this.teams);

    // set default
    if (this.teams.length > 0)
      this.updateSelfBasic(this.teams[0]);
    else
      this.viewCtrl.dismiss();
  }

  adddNewTeam() {
    this.modalCtrl.create(NewTeamPage).present();
  }

  updateSelfBasic(teamId: string) {
    // this.playerBasic.teamId = teamId;
    // this.playerService.saveSelfBasic(this.playerBasic);
  }
}
