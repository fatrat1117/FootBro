import { Component, ViewChild } from '@angular/core';
import { ViewController, NavParams} from 'ionic-angular';

import { PlayerService } from '../../app/players/player.service'

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>{{ 'Description' | trans }}</ion-title>
      <ion-buttons left>
        <button (click)="dismiss()" ion-button icon-only>
          <ion-icon name="md-close" color="danger"></ion-icon>
        </button>
      </ion-buttons>
      <ion-buttons right>
        <button [disabled] = "!isSavable" (click)="save()" text-center ion-button clear color="primary">
          {{ 'Save' | trans }}
        </button>
      </ion-buttons>
    </ion-navbar>
  </ion-header>
  
  <ion-content>
    <ion-item>
      <ion-textarea #valueInput type="text" rows="6" maxlength="128" clearInput [(ngModel)]="newValue" (ngModelChange)=onValueChange()>
      </ion-textarea>
    </ion-item>
  </ion-content>
  `
})
export class EditPlayerDescriptionPage {
  @ViewChild('valueInput') valueInput;

  oldValue: string;
  newValue: string;
  isSavable: boolean;
  constructor(private viewCtrl: ViewController, private navParams: NavParams, private playerService: PlayerService) {
    this.isSavable = false;
  }

  ionViewDidLoad() {
    this.oldValue = this.navParams.get("description");
    this.newValue = this.oldValue;

    setTimeout(() => {
      this.valueInput.setFocus();
    }, 500);
  }

  onValueChange() {
    this.isSavable = (this.newValue != this.oldValue);
  }

  save() {
    this.playerService.updatePlayerDetail('description', this.newValue);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}


