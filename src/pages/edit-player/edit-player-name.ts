import { Component } from '@angular/core';
import { ViewController} from 'ionic-angular';

import { PlayerBasic } from '../../app/players/shared/player.model'
import { PlayerService } from '../../app/players/shared/player.service'

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>{{'Nickname' | trans}}</ion-title>
      <ion-buttons start> <!--showWhen="ios"-->
        <button (click)="dismiss()" text-center ion-button clear color="light">
          {{ 'Cancel' | trans }}
        </button>
      </ion-buttons>
      <ion-buttons end>
        <button [disabled] = "newName == playerBasic?.displayName" (click)="save()" text-center ion-button clear color="primary">
          {{ 'Save' | trans }}
        </button>
      </ion-buttons>
    </ion-navbar>
  </ion-header>

  <ion-content>
    <ion-input type="text" maxlength="32" [(ngModel)]="newName">
    </ion-input>
  </ion-content>
  `,
  providers: [PlayerService]
})
export class EditPlayerNamePage {
  playerBasic: PlayerBasic;
  newName: string;
  constructor(private viewCtrl: ViewController, private playerService: PlayerService) {
  }

  ionViewDidLoad() {
    this.playerService.getSelfBasic().then(playerBasic => {
      this.playerBasic = playerBasic;
      this.newName = playerBasic.displayName;
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}


