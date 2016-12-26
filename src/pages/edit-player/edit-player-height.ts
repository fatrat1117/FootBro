import { Component, ViewChild } from '@angular/core';
import { ViewController} from 'ionic-angular';

import { PlayerDetail } from '../../app/players/shared/player.model'
import { PlayerService } from '../../app/players/shared/player.service'

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
  `,
  providers: [PlayerService]
})
export class EditPlayerHeightPage {
  @ViewChild('valueInput') valueInput;

  playerDetail: PlayerDetail;
  newValue: string;
  isSavable: boolean;
  constructor(private viewCtrl: ViewController, private playerService: PlayerService) {
    this.isSavable = false;
  }

  ionViewDidLoad() {
    this.playerService.getSelfDetail().then(playerDetail => {
      this.playerDetail = playerDetail;
      this.newValue = playerDetail.height.toString();
    });

    this.valueInput.setFocus();
  }

  onValueChange() {
    this.isSavable = (this.newValue.trim().length != 0 && this.newValue != this.playerDetail.height.toString());
  }

  save() {
    this.playerDetail.height = Number(this.newValue);
    this.playerService.saveSelfDetail(this.playerDetail);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}


