import { Component, ViewChild } from '@angular/core';
import { ViewController} from 'ionic-angular';

import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'

@Component({
  template: `
  <ion-header>
    <sb-modal-navbar title="Nickname" buttonName="Save" [isEnabled]="isSavable" (onFinish)="save()"></sb-modal-navbar>
  </ion-header>

  <ion-content>
    <ion-item>
      <ion-input #valueInput type="text" maxlength="32" clearInput [(ngModel)]="newValue" (ngModelChange)=onValueChange()>
      </ion-input>
    </ion-item>
  </ion-content>
  `
})
export class EditPlayerNamePage {
  @ViewChild('valueInput') valueInput;

  player: Player;
  newValue: string;
  isSavable: boolean;
  constructor(private viewCtrl: ViewController, private playerService: PlayerService) {
    this.isSavable = false;
  }

  ionViewDidLoad() {
    // this.playerService.getSelfBasic().then(playerBasic => {
    //   this.playerBasic = playerBasic;
    //   this.newValue = playerBasic.displayName;
    // });

    this.valueInput.setFocus();
  }

  onValueChange() {
    this.isSavable = (this.newValue.trim().length != 0 && this.newValue != this.playerBasic.displayName);
  }

  save() {
    this.player.displayName = this.newValue;
    // this.playerService.saveSelfBasic(this.playerBasic);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}


