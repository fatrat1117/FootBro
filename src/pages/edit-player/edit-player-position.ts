import { Component, ViewChild } from '@angular/core';
import { ViewController} from 'ionic-angular';

import { PlayerDetail } from '../../app/players/shared/player.model'
import { PlayerService } from '../../app/players/shared/player.service'

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>{{ 'Position' | trans }}</ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content>
    <ion-list>
      <ion-item *ngFor="let v of values" (click)="changePosition(v)">
        <h2>{{ v | trans }}</h2>
        <ion-icon *ngIf="v == selectedValue" item-right name="checkmark" color="primary"></ion-icon>
      </ion-item>
    </ion-list>
  </ion-content>
  `,
  providers: [PlayerService]
})
export class EditPlayerPositionPage {
  playerDetail: PlayerDetail;
  values: string[];
  selectedValue: string;
  constructor(private viewCtrl: ViewController, private playerService: PlayerService) {
    this.values = ["gk", "cb", "sb", "dmf", "amf", "cf", "sf"];
  }

  ionViewDidLoad() {
    this.playerService.getSelfDetail().then(playerDetail => {
      this.playerDetail = playerDetail;
      this.selectedValue = playerDetail.position;
    });
  }

  changePosition(position: string) {
    this.selectedValue = position;
    this.save();
  }

  save() {
    this.playerDetail.position = this.selectedValue;
    this.playerService.saveSelfDetail(this.playerDetail);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}


