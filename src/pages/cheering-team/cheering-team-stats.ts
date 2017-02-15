import { Component } from '@angular/core';
import { ViewController, AlertController, ToastController, NavParams} from 'ionic-angular';

import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'

@Component({
  template: `
  <ion-header>
    <sb-modal-navbar title="夏一天" buttonName="Unlock" isEnabled="true" (onFinish)="unlock()"></sb-modal-navbar>
  </ion-header>

  <ion-content>
    <ion-item-group>
      <ion-item>
        <ion-icon name="md-unlock" item-left></ion-icon>
          Unlock points
        <ion-note color="primary-text" item-right>5</ion-note>
      </ion-item>
      <ion-item>
        <ion-icon name="md-pin" item-left></ion-icon>
          Location
        <ion-note item-right color="primary-text">Singapore</ion-note>
      </ion-item>
      <ion-item>
        <ion-icon name="md-calendar" item-left></ion-icon>
          Join date
        <ion-note item-right color="primary-text">2015-01-01</ion-note>
      </ion-item>

      <ion-item-divider></ion-item-divider>
      <ion-item>
        <ion-range min="0" max="100" [(ngModel)]="responseRate">
          <ion-label range-left>Response Rate</ion-label>
          <ion-label range-right>{{ responseRate }} %</ion-label>
        </ion-range>
      </ion-item>
    </ion-item-group>
  </ion-content>
  `
})
export class CheeringTeamStatsPage {
  selfPlayer: Player;
  player: Player;
  responseRate: number;
  constructor(private viewCtrl: ViewController, private alertCtrl: AlertController, 
              private navParams: NavParams, private playerService: PlayerService, 
              private toastCtrl: ToastController) {
    this.responseRate = 40;
  }

  ionViewDidLoad() {
    this.selfPlayer = this.playerService.getSelfPlayer();
    this.player = this.navParams.get("player");
  }

  unlock() {
    //this.showWarning();
    this.showConfirm();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  showWarning() {
    this.alertCtrl.create({
      title: 'Not enough points',
      subTitle: 'Current balance: ' + this.player.points,
      message: 'You need at least 5 points to unlock her.',
      buttons: ['OK']
    }).present();
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: '5 points needed',
      subTitle: 'Balance: ' + this.player.points,
      message: 'You will be able to message her once unlocked.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.unlockCheerleader()
            //this.playerService.placeOrder('2qJEDrRMODbPOafc3cts4jbgS7z2', 5);
            this.dismiss();
          }
        },
        {
          text: 'Cancel',
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
  }

  unlockCheerleader() {
    let amount = Math.floor(this.player.unlockPoints / 10) * 10;
    if (this.selfPlayer.points >= amount) {
      this.playerService.placeOrder(this.player.id, amount);
      this.playerService.unlockCheerleader(
        this.player.id, this.player.points + amount, this.player.unlockPoints + 1, this.selfPlayer.points - amount);
    }
    else {
      this.toastCtrl.create({
        message: 'Not enough points.',
        duration: 2000,
        position: 'top'
      }).present();
    }
  }
}
