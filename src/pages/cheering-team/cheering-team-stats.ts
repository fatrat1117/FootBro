import { Component } from '@angular/core';
import { ViewController, AlertController, ToastController, NavParams} from 'ionic-angular';

import { Cheerleader } from '../../app/cheerleaders/cheerleader.model'

import { Player} from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'

@Component({
  selector: 'page-cheering-team-stats',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>{{ cheerleader?.name }}</ion-title>
      <ion-buttons left>
        <button (click)="dismiss()" ion-button icon-only>
          <ion-icon name="md-close" color="danger"></ion-icon>
        </button>
      </ion-buttons>
      <ion-buttons right>
        <button (click)="unlock()" [disabled]="selfPlayer == null" text-center ion-button clear color="primary">
          {{ 'Unlock' | trans }}
        </button>
      </ion-buttons>
    </ion-navbar>
  </ion-header>

  <ion-content>
    <ion-item-group>
      <ion-item>
        <ion-icon name="md-unlock" item-left></ion-icon>
          {{ 'unlockPoints' | trans }}
        <ion-note color="primary-text" item-right>{{ unlockAmount }}</ion-note>
      </ion-item>
      <ion-item>
        <ion-icon name="md-pin" item-left></ion-icon>
          {{ 'Location' | trans }}
        <ion-note item-right color="primary-text">Singapore</ion-note>
      </ion-item>
      <ion-item>
        <ion-icon name="md-calendar" item-left></ion-icon>
          {{ 'joinDate' | trans }}
        <ion-note item-right color="primary-text">{{ cheerleader?.joinTime | date:'yyyy-MM-dd' }}</ion-note>
      </ion-item>

      <ion-item>
        <ion-row class="ResponseRateRow">
          <ion-col class="col-30"></ion-col>
          <ion-col class="col-40">
            <sb-rate-circle title="ResponseRate" [rate]="cheerleader?.responseRate"></sb-rate-circle>
          </ion-col>
          <ion-col class="col-30"></ion-col>
        </ion-row>
      </ion-item>
    </ion-item-group>
  </ion-content>
  `
})
export class CheeringTeamStatsPage {
  selfPlayer: Player;
  cheerleader: Cheerleader;
  onPlayerReady;
  unlockAmount: number;
  constructor(private viewCtrl: ViewController, private alertCtrl: AlertController,
              private navParams: NavParams, private playerService: PlayerService,
              private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.addEventListeners();
    this.cheerleader = this.navParams.get("cheerleader");
    console.log(this.cheerleader);
    
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
      //this.playerService.placeOrder(this.cheerleader.id, amount);
      this.playerService.unlockCheerleader(
        this.cheerleader.id, this.cheerleader.points + this.unlockAmount, this.cheerleader.unlockPoints + 1, this.selfPlayer.points - this.unlockAmount);
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
