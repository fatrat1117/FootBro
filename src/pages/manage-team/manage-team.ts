import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PlayerBasic } from '../../app/players/shared/player.model'
import { PlayerService } from '../../app/players/shared/player.service'


@Component({
  selector: 'page-manage-team',
  templateUrl: 'manage-team.html'
})
export class ManageTeamPage {
  playerBasic: PlayerBasic;
  teams: string[];
  constructor(private navCtrl: NavController, private playerService: PlayerService) {

  }

  ionViewDidLoad() {
    this.playerService.getSelfBasic().then(playerBasic => {
      this.playerBasic = playerBasic;
    })

    this.playerService.getSelfTeams().then(teams => {
      this.teams = teams;
    });
  }
  
  setDefaultTeam(id: string) {
    this.playerBasic.teamId = id;
    this.playerService.saveSelfBasic(this.playerBasic);
  }

  quitTeam(index: number) {
    this.teams.splice(index, 1);
    this.playerService.saveSelfTeams(this.teams);
  }
}
