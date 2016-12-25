import { Component, ViewChild } from '@angular/core';
import { ViewController} from 'ionic-angular';

import { PlayerDetail } from '../../app/players/shared/player.model'
import { PlayerService } from '../../app/players/shared/player.service'

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>{{'WeightKG' | trans}}</ion-title>
      <ion-buttons start> <!--showWhen="ios"-->
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
      <ion-input #valueInput type="number" clearInput [(ngModel)]="newValue" (ngModelChange)=onValueChange()>
      </ion-input>
    </ion-item>
  </ion-content>
  `,
  providers: [PlayerService]
})
export class EditPlayerWeightPage {
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
      this.newValue = playerDetail.weight.toString();
    });

    this.valueInput.setFocus();
  }

  onValueChange() {
    this.isSavable = (this.newValue != '' && this.newValue != this.playerDetail.weight.toString());
  }

  save() {
    this.playerDetail.weight = Number(this.newValue);
    this.playerService.saveSelfDetail(this.playerDetail);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}


