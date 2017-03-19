import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'
import { ChatPage } from '../chat/chat'

@Component({
  selector: 'page-my-player',
  templateUrl: 'my-player.html',
})
export class MyPlayerPage {
  selfId: string;
  id;
  player = new Player();
  //af
  NumOfLikes: number;
  NumOfUnLikes: number;
  PercentOfLikes: number;
  PercentOfUnLikes: number;
  onPlayerReady;

  constructor(private navCtrl: NavController, private service: PlayerService, params: NavParams) {
    this.id = params.get('id');
    
    var fromDBLikes = 213;
    var fromDBUnLikes = 67;
    this.NumOfLikes = fromDBLikes;
    this.NumOfUnLikes = fromDBUnLikes;
    this.PercentOfLikes = fromDBLikes / (fromDBLikes + fromDBUnLikes) * 100;
    this.PercentOfUnLikes = fromDBUnLikes / (fromDBLikes + fromDBUnLikes) * 100;
  }

  ionViewDidLoad() {
    this.selfId = this.service.selfId();
    this.onPlayerReady = e => {
      let id = e['detail'];
      if (this.id === id)
        this.player = this.service.getPlayer(id);
    };

    document.addEventListener('serviceplayerready', this.onPlayerReady);

    this.service.getPlayerAsync(this.id);
    this.service.increasePopularity(this.id);
  }

  ionViewWillUnload() {
    document.removeEventListener('serviceplayerready', this.onPlayerReady);
  }

  enterChatPage() {
    if (this.service.isAuthenticated()) {
      this.navCtrl.push(ChatPage, {
        isSystem: false,
        isUnread: false,
        user: this.player
      })
    }
    else
      this.service.checkLogin();
  }
}
