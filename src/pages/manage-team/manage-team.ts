import { Component } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';

import { CreateTeamPage } from '../create-team/create-team'
import { EditTeamPage } from '../edit-team/edit-team'

import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'

import { Team } from '../../app/teams/team.model'
import { TeamService } from '../../app/teams/team.service'


@Component({
  selector: 'page-manage-team',
  templateUrl: 'manage-team.html'
})
export class ManageTeamPage {
  selfId: string;
  player: Player;
  teams: Team[];
  constructor(private viewCtrl: ViewController, private modalCtrl: ModalController, 
              private playerService: PlayerService, private teamService: TeamService) {

    this.selfId = this.playerService.selfId();
    this.teams = [];
  }

  ionViewDidLoad() {
    this.addEventListeners();
    this.playerService.getPlayerAsync(this.selfId);
    this.teamService.getPlayerTeamsAsync(this.selfId);
  }

  addEventListeners() {
    document.addEventListener('serviceplayerready', e => {
      let playerId = e['detail'];
      if (playerId === this.selfId) {
        this.player = this.playerService.getPlayer(playerId);
      }
    });

    document.addEventListener('serviceplayerteamsready', e=> {
      let id = e['detail'];
      if (id === this.selfId) {
        this.updatePlayerTeams();
      }
    });
  }

  setDefaultTeam(id: string, slidingItem) {
    slidingItem.close();
    this.playerService.setDefaultTeam(id);
    this.updatePlayerTeams();
  }

  quitTeam(id: string, slidingItem) {
    slidingItem.close();
    this.playerService.quitTeam(id);
    this.teamService.getPlayerTeamsAsync(this.playerService.selfId());
  }

  editTeam(teamId: string, slidingItem) {
    slidingItem.close();
    this.modalCtrl.create(EditTeamPage, {
      teamId: teamId
    }).present();
  }

  updatePlayerTeams() {
    this.teams = [];
    for(var t of this.teamService.getPlayerTeams(this.selfId)) {
      if (t.id == this.player.teamId)
        this.teams.unshift(t);
      else
        this.teams.push(t);
    }
  }

  createTeam() {
    this.modalCtrl.create(CreateTeamPage).present();
    /*
    let model = this.modalCtrl.create(CreateTeamPage);
    model.onDidDismiss (() => {
      this.updatePlayerTeams();
    })
    model.present();
    */
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

  adddNewTeam() {
    this.modalCtrl.create(CreateTeamPage).present();
  }

  updateSelfBasic(teamId: string) {
    // this.playerBasic.teamId = teamId;
    // this.playerService.saveSelfBasic(this.playerBasic);
  }
  */
}
