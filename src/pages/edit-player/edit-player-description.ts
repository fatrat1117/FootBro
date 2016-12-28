import { Component, ViewChild } from '@angular/core';
import { ViewController} from 'ionic-angular';

import { PlayerDetail } from '../../app/players/shared/player.model'
import { PlayerService } from '../../app/players/shared/player.service'

@Component({
  template: `
  <ion-header>
    <sb-modal-navbar title="Description" buttonName="Save" [isEnabled]="isSavable" (onFinish)="save()"></sb-modal-navbar>
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

  playerDetail: PlayerDetail;
  newValue: string;
  isSavable: boolean;
  constructor(private viewCtrl: ViewController, private playerService: PlayerService) {
    this.isSavable = false;
  }

  ionViewDidLoad() {
    this.playerService.getSelfDetail().then(playerDetail => {
      this.playerDetail = playerDetail;
      this.newValue = playerDetail.description;
    });

    this.valueInput.setFocus();
  }

  onValueChange() {
    this.isSavable = (this.newValue != this.playerDetail.description);
  }

  save() {
    this.playerDetail.description = this.newValue;
    this.playerService.saveSelfDetail(this.playerDetail);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}

