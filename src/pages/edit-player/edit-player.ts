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
  onPlayerReady;
  isCheerleader = false;

  constructor(private navCtrl: NavController, private modalCtrl: ModalController, private playerService: PlayerService, private teamService: TeamService) {
    this.selfId = this.playerService.selfId();
    //this.teams = [];
  }

  ionViewDidLoad() {
    this.addEventListeners();
    this.playerService.getPlayerAsync(this.selfId);
    //this.teamService.getPlayerTeamsAsync(this.playerService.selfId());
  }

  ionViewWillUnload() {
    document.removeEventListener('serviceplayerready', this.onPlayerReady);
  }

  addEventListeners() {
    this.onPlayerReady = e => {
      let playerId = e['detail'];
      if (playerId === this.selfId) {
        this.player = this.playerService.getPlayer(playerId);
        this.isCheerleader = this.player.role == 'cheerleader';
      }
    };

    // player
    document.addEventListener('serviceplayerready', this.onPlayerReady);
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
}