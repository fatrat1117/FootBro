import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

// import { EditPlayerNamePage } from './edit-player-name'
// import { EditPlayerHeightPage } from './edit-player-height'
// import { EditPlayerWeightPage } from './edit-player-weight'
// import { EditPlayerPositionPage } from './edit-player-position'
// import { EditPlayerFootPage } from './edit-player-foot'
// import { EditPlayerDescriptionPage } from './edit-player-description'

import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'


@Component({
  selector: 'page-edit-player',
  templateUrl: 'edit-player.html'
})
export class EditPlayerPage {
  player : Player;
  isSavable: boolean;
  constructor(private navCtrl: NavController, private modalCtrl: ModalController, private playerService: PlayerService) {
  }

  ionViewDidLoad() {
    this.isSavable = false;

//     this.playerService.getSelfBasic().then(playerBasic => {
//       //this.playerBasic = playerBasic;
//     });

//     this.playerService.getSelfDetail().then(playerDetail => {
// //this.playerDetail = playerDetail;
//     });
  }

  editName() {
    //this.modalCtrl.create(EditPlayerNamePage).present();
  }

  editHeight() {
    //this.modalCtrl.create(EditPlayerHeightPage).present();
  }

  editWeight() {
    //this.modalCtrl.create(EditPlayerWeightPage).present();
  }

  editPosition() {
   // this.modalCtrl.create(EditPlayerPositionPage).present();
  }

  editFoot() {
    //this.modalCtrl.create(EditPlayerFootPage).present();
  }

  editDescription() {
    //this.modalCtrl.create(EditPlayerDescriptionPage).present();
  }
}


