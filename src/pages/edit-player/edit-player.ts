import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { EditPlayerNamePage } from './edit-player-name'

import { PlayerBasic, PlayerDetail } from '../../app/players/shared/player.model'
import { PlayerService } from '../../app/players/shared/player.service'


@Component({
  selector: 'page-edit-player',
  templateUrl: 'edit-player.html',
  providers: [PlayerService]
})
export class EditPlayerPage {
  playerBasic: PlayerBasic;
  playerDetail: PlayerDetail;
  isSavable: boolean;
  constructor(private navCtrl: NavController, private modalCtrl: ModalController, private playerService: PlayerService) {
  }

  ionViewDidLoad() {
    this.isSavable = false;

    this.playerService.getSelfBasic().then(playerBasic => {
      this.playerBasic = playerBasic;
    });

    this.playerService.getSelfDetail().then(playerDetail => {
      this.playerDetail = playerDetail;
    });
  }

  editName() {
    this.modalCtrl.create(EditPlayerNamePage).present();
  }
}


