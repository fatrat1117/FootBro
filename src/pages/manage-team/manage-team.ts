import { Component } from '@angular/core';
import { ViewController, NavController, ModalController } from 'ionic-angular';

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
  onPlayerReady;
  onPlayerTeamsReady;

  constructor(private viewCtrl: ViewController, private navCtrl: NavController, private modalCtrl: ModalController, 
              private playerService: PlayerService, private teamService: TeamService) {

    this.selfId = this.playerService.selfId();
    this.teams = [];
  }

  ionViewDidLoad() {
    this.addEventListeners();
    this.playerService.getPlayerAsync(this.selfId);
    this.teamService.getPlayerTeamsAsync(this.selfId);
  }

  ionViewWillUnload() {
    document.removeEventListener('serviceplayerready', this.onPlayerReady);
    document.removeEventListener('serviceplayerteamsready', this.onPlayerTeamsReady);
  }

  addEventListeners() {
    this.onPlayerReady = e => {
      let playerId = e['detail'];
      if (playerId === this.selfId) {
        this.player = this.playerService.getPlayer(playerId);
      }
    };

    this.onPlayerTeamsReady = e=> {
      let id = e['detail'];
      if (id === this.selfId) {
        this.updatePlayerTeams();
      }
    };

    document.addEventListener('serviceplayerready', this.onPlayerReady);
    document.addEventListener('serviceplayerteamsready', this.onPlayerTeamsReady);
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
    this.navCtrl.push(EditTeamPage, {
      teamId: teamId
    });
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

  allowToQuit(team: Team) {
    return this.player.teamId != team.id && (this.player.id != team.captain || team.totalPlayers == 1);
  }

  canShowEdit(teamId) {
    return this.playerService.amICaptainOrAdmin(teamId);
  }
}
