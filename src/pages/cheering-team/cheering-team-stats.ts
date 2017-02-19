import { Component } from '@angular/core';
import { ViewController, AlertController, ToastController, NavParams} from 'ionic-angular';

import { Cheerleader } from '../../app/cheerleaders/cheerleader.model'

import { Player} from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'

@Component({
  template: `
  <ion-header>
    <sb-modal-navbar [title]="cheerleader?.name" buttonName="Unlock" isEnabled="true" (onFinish)="unlock()"></sb-modal-navbar>
  </ion-header>

  <ion-content>
    <ion-item-group>
      <ion-item>
        <ion-icon name="md-unlock" item-left></ion-icon>
          Unlock points
        <ion-note color="primary-text" item-right>{{ cheerleader?.unlockPoints }}</ion-note>
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
        <ion-range min="0" max="100" [ngModel]="cheerleader?.responseRate">
          <ion-label range-left>Response Rate</ion-label>
          <ion-label range-right>{{ cheerleader?.responseRate }} %</ion-label>
        </ion-range>
      </ion-item>
    </ion-item-group>
  </ion-content>
  `
})
export class CheeringTeamStatsPage {
  selfPlayer: Player;
  cheerleader: Cheerleader;
  constructor(private viewCtrl: ViewController, private alertCtrl: AlertController, 
              private navParams: NavParams, private playerService: PlayerService, 
              private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.selfPlayer = this.playerService.getSelfPlayer();
    this.cheerleader = this.navParams.get("cheerleader");
  }

  unlock() {
    let amount = Math.floor(this.cheerleader.unlockPoints / 10) * 10;
    if (this.selfPlayer.points >= amount)
      this.showConfirm(amount);
    else
      this.showWarning();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  showWarning() {
    this.alertCtrl.create({
      title: 'Not enough points',
      subTitle: 'Current balance: ' + this.selfPlayer.points,
      message: `You need at least ${this.cheerleader.unlockPoints} points to unlock her.`,
      buttons: ['OK']
    }).present();
  }

  showConfirm(amount: number) {
    let confirm = this.alertCtrl.create({
      title: `${amount} points needed`,
      subTitle: 'Balance: ' + this.selfPlayer.points,
      message: 'You will be able to message her once unlocked.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.unlockCheerleader(amount)
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

  unlockCheerleader(amount: number) {
    //let amount = Math.floor(this.cheerleader.unlockPoints / 10) * 10;
    if (this.selfPlayer.points >= amount) {
      this.playerService.placeOrder(this.cheerleader.id, amount);
      this.playerService.unlockCheerleader(
        this.cheerleader.id, this.cheerleader.points + amount, this.cheerleader.unlockPoints + 1, this.selfPlayer.points - amount);
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
