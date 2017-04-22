import { Component } from '@angular/core';
import { ViewController, AlertController, ToastController, NavParams } from 'ionic-angular';

import { Localization } from '../../providers/localization';

import { Cheerleader } from '../../app/cheerleaders/cheerleader.model'
import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'
import { ChatService } from '../../app/chats/chat.service'

declare var sprintf: any;

@Component({
  selector: 'page-cheering-team-stats',
  templateUrl: 'cheering-team-stats.html',
  providers: [ChatService]
})

export class CheeringTeamStatsPage {
  selfPlayer: Player;
  cheerleader: Cheerleader;
  onPlayerReady;
  unlockAmount: number;
  increaseUnlockpoint = 10;
  constructor(private viewCtrl: ViewController, private alertCtrl: AlertController, private chatService: ChatService, 
    navParams: NavParams, private playerService: PlayerService,
    private toastCtrl: ToastController, private local: Localization) {
    this.cheerleader = navParams.get("cheerleader");
  }

  ionViewDidLoad() {
    this.addEventListeners();
    //console.log(this.cheerleader);

    this.unlockAmount = Math.floor(this.cheerleader.unlockPoints / 10) * 10;

    this.playerService.getPlayerAsync(this.playerService.selfId());
  }

  ionViewWillUnload() {
    document.removeEventListener('serviceplayerready', this.onPlayerReady);
  }

  addEventListeners() {
    this.onPlayerReady = e => {
      let playerId = e['detail'];
      if (playerId === this.playerService.selfId()) {
        this.selfPlayer = this.playerService.getPlayer(playerId);
      }
    };

    document.addEventListener('serviceplayerready', this.onPlayerReady);
  }

  unlock() {
    //let amount = Math.floor(this.cheerleader.unlockPoints / 10) * 10;
    if (this.selfPlayer.points >= this.unlockAmount)
      this.showConfirm(this.unlockAmount);
    else
      this.showWarning();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  showWarning() {
    this.alertCtrl.create({
      title: this.local.getString('notEnoughPoints'),
      subTitle: this.local.getString('balance') + this.selfPlayer.points,
      message: sprintf(this.local.getString('pointsNedded'), this.cheerleader.unlockPoints),
      buttons: [this.local.getString('OK')]
    }).present();
  }

  showConfirm(amount: number) {
    let confirm = this.alertCtrl.create({
      title: sprintf(this.local.getString('pointsNedded'), amount),
      subTitle: this.local.getString('balance') + this.selfPlayer.points,
      message: this.local.getString('unlockMsg'),
      buttons: [
        {
          text: this.local.getString('Cancel'),
          handler: () => {
          }
        },
        {
          text: this.local.getString('OK'),
          handler: () => {
            this.unlockCheerleader(amount)
            //this.playerService.placeOrder('2qJEDrRMODbPOafc3cts4jbgS7z2', 5);
            this.dismiss();
          }
        }
      ]
    });
    confirm.present();
  }

  unlockCheerleader(amount: number) {
    //let amount = Math.floor(this.cheerleader.unlockPoints / 10) * 10;
    if (this.selfPlayer.points >= amount) {
      //this.playerService.placeOrder(this.cheerleader.id, amount);
      this.playerService.unlockCheerleader(
        this.cheerleader.id, this.cheerleader.points + this.unlockAmount * 0.5, this.cheerleader.unlockPoints + this.increaseUnlockpoint, this.selfPlayer.points - this.unlockAmount);
      

      this.chatService.sendChat(this.cheerleader.id, this.cheerleader.pushId, sprintf(this.local.getString('unlockDefaultMsg'), this.cheerleader.name));
    }
    else {
      this.toastCtrl.create({
        message: this.local.getString('notEnoughPoints'),
        duration: 2000,
        position: 'top'
      }).present();
    }
  }
}
