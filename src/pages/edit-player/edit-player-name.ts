import { Component, ViewChild } from '@angular/core';
import { ViewController} from 'ionic-angular';

import { PlayerBasic } from '../../app/players/shared/player.model'
import { PlayerService } from '../../app/players/shared/player.service'

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>{{ 'Nickname' | trans }}</ion-title>
      <ion-buttons start showWhen="ios">
        <button (click)="dismiss()" text-center ion-button clear color="light">
          {{ 'Cancel' | trans }}
        </button>
      </ion-buttons>
      <ion-buttons end>
        <button [disabled] = "!isSavable" (click)="save()" text-center ion-button clear color="primary">
          {{ 'Save' | trans }}
        </button>
      </ion-buttons>
    </ion-navbar>
  </ion-header>

  <ion-content>
    <ion-item>
      <ion-input #valueInput type="text" maxlength="32" clearInput [(ngModel)]="newValue" (ngModelChange)=onValueChange()>
      </ion-input>
    </ion-item>
  </ion-content>
  `,
  providers: [PlayerService]
})
export class EditPlayerNamePage {
  @ViewChild('valueInput') valueInput;

  playerBasic: PlayerBasic;
  newValue: string;
  isSavable: boolean;
  constructor(private viewCtrl: ViewController, private playerService: PlayerService) {
    this.isSavable = false;
  }

  ionViewDidLoad() {
    this.playerService.getSelfBasic().then(playerBasic => {
      this.playerBasic = playerBasic;
      this.newValue = playerBasic.displayName;
    });

    this.valueInput.setFocus();
  }

  onValueChange() {
    this.isSavable = (this.newValue != '' && this.newValue != this.playerBasic.displayName);
  }

  save() {
    this.playerBasic.displayName = this.newValue;
    this.playerService.saveSelfBasic(this.playerBasic);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}


