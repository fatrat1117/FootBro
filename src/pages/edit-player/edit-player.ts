import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { EditPlayerNamePage } from './edit-player-name'
import { EditPlayerHeightPage } from './edit-player-height'
import { EditPlayerWeightPage } from './edit-player-weight'
import { EditPlayerPositionPage } from './edit-player-position'
import { EditPlayerFootPage } from './edit-player-foot'
import { EditPlayerDescriptionPage } from './edit-player-description'

import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'
import { Team } from '../../app/teams/team.model'
import { TeamService } from '../../app/teams/team.service'


@Component({
  selector: 'page-edit-player',
  templateUrl: 'edit-player.html'
})
export class EditPlayerPage {
  selfId: string;
  player: Player;
  watchListMap: {};
  teams;
  constructor(private modalCtrl: ModalController, private playerService: PlayerService, private teamService: TeamService) {
    this.selfId = this.playerService.selfId();
  }

  ionViewDidLoad() {
    this.watchListMap = {}
    this.addEventListeners();
    this.playerService.getPlayerAsync(this.selfId);
    this.teamService.getPlayerTeamsAsync(this.playerService.selfId());
  }

  addEventListeners() {
    // player
    document.addEventListener('serviceplayerready', e => {
      let playerId = e['detail'];
      if (playerId === this.selfId) {
        this.player = this.playerService.getPlayer(playerId);
        
        this.watchListMap = {}
        for (let id of this.player.teams) {
          this.watchListMap[id] = {}
          this.teamService.getTeamAsync(id);
          
        }
      }
    });

    document.addEventListener('serviceteamready', e => {
      let id = e['detail'];
      if (this.watchListMap[id]) {
        this.watchListMap[id] = this.teamService.getTeam(id);
      }
    });

    document.addEventListener('serviceplayerteamsready', e=> {
      let id = e['detail'];
      if (id === this.player.id) {
        this.teams = this.teamService.getPlayerTeams(id);
        //console.log(this.teams);
      }
    });
  }

  editName() {
    this.modalCtrl.create(EditPlayerNamePage, {
      name: this.player.name
    }).present();
  }

  editHeight() {
    this.modalCtrl.create(EditPlayerHeightPage, {
      height: this.player.height
    }).present();
  }

  editWeight() {
    this.modalCtrl.create(EditPlayerWeightPage, {
      weight: this.player.weight
    }).present();
  }

  editPosition() {
   this.modalCtrl.create(EditPlayerPositionPage, {
     position: this.player.position
   }).present();
  }

  editFoot() {
    this.modalCtrl.create(EditPlayerFootPage, {
      foot: this.player.foot
    }).present();
  }

  editDescription() {
    this.modalCtrl.create(EditPlayerDescriptionPage, {
      description: this.player.description
    }).present();
  }

  manageTeams() {

  }
}


