import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PlayerBasic } from '../../app/players/shared/player.model'

import { PlayerService } from '../../app/players/shared/player.service'

import { MyPlayerPage } from "../my-player/my-player";

@Component({
  selector: 'page-me',
  templateUrl: 'me.html',
  providers: [PlayerService]
})
export class MePage {
  player: PlayerBasic;
  constructor(private navCtrl: NavController, private playerService: PlayerService) {

  }

  

  ionViewDidLoad() {
    this.playerService.getSelfBasic().then(player => {
      this.player = player;
      //console.log(player);
      
    });
  }
  

  goPlayerPage() {
    this.navCtrl.push(MyPlayerPage);
  }
}
