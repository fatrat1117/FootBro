import { Component } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';

import { CreateTeamPage } from '../create-team/create-team'

import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'

import { Team } from '../../app/teams/team.model'
import { TeamService } from '../../app/teams/team.service'


@Component({
  selector: 'page-manage-team',
  templateUrl: 'manage-team.html'
})
export class ManageTeamPage {
  player: Player;
  watchListMap : {};
  constructor(private viewCtrl: ViewController, private modalCtrl: ModalController, 
              private playerService: PlayerService, private teamService: TeamService) {
  }

  ionViewDidLoad() {
    this.watchListMap = {}
    this.addEventListeners();

    for (let id of this.player.teams) {
      this.teamService.getTeamAsync(id);
      this.watchListMap[id] = {}
    }
  }

  addEventListeners() {
    document.addEventListener('serviceteamready', e => {
      let id = e['detail'];
      if (this.watchListMap[id]) {
        this.watchListMap[id] = this.teamService.getTeam(id);
      }
    })
  }
  
  /*
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
  */

  adddNewTeam() {
    this.modalCtrl.create(CreateTeamPage).present();
  }

  updateSelfBasic(teamId: string) {
    // this.playerBasic.teamId = teamId;
    // this.playerService.saveSelfBasic(this.playerBasic);
  }
}
