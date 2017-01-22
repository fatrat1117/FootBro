import { Component } from '@angular/core';
import { ViewController} from 'ionic-angular';

import { PlayerDetail } from '../../app/players/shared/player.model'
import { PlayerService } from '../../app/players/shared/player.service'

@Component({
  template: `
  <ion-header>
    <sb-modal-navbar title="Foot" (onFinish)="save()"></sb-modal-navbar>
  </ion-header>

  <ion-content>
    <ion-list>
      <ion-item *ngFor="let v of values" (click)="changePosition(v)">
        <h2>{{ v | trans }}</h2>
        <ion-icon *ngIf="v == selectedValue" item-right name="md-checkmark" color="primary"></ion-icon>
      </ion-item>
    </ion-list>
  </ion-content>
  `
})
export class EditPlayerFootPage {
  playerDetail: PlayerDetail;
  values: string[];
  selectedValue: string;
  constructor(private viewCtrl: ViewController, private playerService: PlayerService) {
    this.values = ["left", "right"];
  }

  ionViewDidLoad() {
    this.playerService.getSelfDetail().then(playerDetail => {
      this.playerDetail = playerDetail;
      this.selectedValue = playerDetail.foot;
    });
  }

  changePosition(position: string) {
    this.selectedValue = position;
    this.save();
  }

  save() {
    this.playerDetail.foot = this.selectedValue;
    this.playerService.saveSelfDetail(this.playerDetail);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}


