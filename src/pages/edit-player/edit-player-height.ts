import { Component, ViewChild } from '@angular/core';
import { ViewController, NavParams} from 'ionic-angular';

import { PlayerService } from '../../app/players/player.service'

@Component({
  template: `
  <ion-header>
    <sb-modal-navbar title="HeightCM" buttonName="Save" [isEnabled]="isSavable" (onFinish)="save()"></sb-modal-navbar>
  </ion-header>

  <ion-content>
    <ion-item>
      <ion-input #valueInput type="number" clearInput [(ngModel)]="newValue" (ngModelChange)=onValueChange()>
      </ion-input>
    </ion-item>
  </ion-content>
  `
})
export class EditPlayerHeightPage {
  @ViewChild('valueInput') valueInput;

  oldValue: string;
  newValue: string;
  isSavable: boolean;
  constructor(private viewCtrl: ViewController, private navParams: NavParams, private playerService: PlayerService) {
    this.isSavable = false;
  }

  ionViewDidLoad() {
    this.oldValue = this.navParams.get("height");
    this.newValue = this.oldValue;

    this.valueInput.setFocus();
  }

  onValueChange() {
    this.isSavable = (this.newValue.trim().length != 0 && this.newValue != this.oldValue);
  }

  save() {
    this.playerService.updatePlayerDetail("height", this.newValue);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}


