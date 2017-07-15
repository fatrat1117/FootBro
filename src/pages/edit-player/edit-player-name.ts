import { Component, ViewChild } from '@angular/core';
import { ViewController, NavParams} from 'ionic-angular';

import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>{{ 'NickName' | trans }}</ion-title>
      <ion-buttons left>
        <button (tap)="dismiss()" ion-button icon-only>
          <ion-icon name="md-close" color="danger"></ion-icon>
        </button>
      </ion-buttons>
      <ion-buttons right>
        <button [disabled] = "!isSavable" (tap)="save()" text-center ion-button clear color="primary">
          {{ 'Save' | trans }}
        </button>
      </ion-buttons>
    </ion-navbar>
  </ion-header>

  <ion-content>
    <ion-item>
      <ion-input #valueInput type="text" maxlength="32" [(ngModel)]="newValue" (ngModelChange)=onValueChange()>
      </ion-input>
    </ion-item>
  </ion-content>
  `
})
export class EditPlayerNamePage {
  @ViewChild('valueInput') valueInput;

  oldValue: string;
  newValue: string;
  isSavable: boolean;
  constructor(private viewCtrl: ViewController, private navParams: NavParams, private playerService: PlayerService) {
    this.isSavable = false;
  }

  ionViewDidLoad() {
    this.oldValue = this.navParams.get("name");
    this.newValue = this.oldValue;
    setTimeout(() => {
      this.valueInput.setFocus();
    }, 500);
  }

  onValueChange() {
    this.isSavable = (this.newValue.trim().length != 0 && this.newValue != this.oldValue);
  }

  save() {
    this.playerService.updatePlayerBasic('displayName', this.newValue);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}


