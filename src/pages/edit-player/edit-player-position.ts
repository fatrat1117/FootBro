import { Component } from '@angular/core';
import { ViewController, NavParams} from 'ionic-angular';

import { PlayerService } from '../../app/players/player.service'

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>{{ 'Position' | trans }}</ion-title>
      <ion-buttons left>
        <button (click)="dismiss()" ion-button icon-only>
          <ion-icon name="md-close" color="danger"></ion-icon>
        </button>
      </ion-buttons>
    </ion-navbar>
  </ion-header>

  <ion-content>
    <ion-list>
      <button ion-item *ngFor="let v of values" (click)="changePosition(v)">
        <h2>{{ v | trans }}</h2>
        <ion-icon *ngIf="v == selectedValue" item-end name="md-checkmark" color="primary"></ion-icon>
      </button>
    </ion-list>
  </ion-content>
  `
})
export class EditPlayerPositionPage {
  values: string[];
  oldValue: string;
  selectedValue: string;
  constructor(private viewCtrl: ViewController, private navParams: NavParams, private playerService: PlayerService) {
    this.values = ["gk", "cb", "sb", "dmf", "amf", "cf", "sf"];
  }

  ionViewDidLoad() {
    this.oldValue = this.navParams.get("position");
    this.selectedValue = this.oldValue;
  }

  changePosition(position: string) {
    this.selectedValue = position;
    this.save();
  }

  save() {
    if (this.selectedValue != this.oldValue)
      this.playerService.updatePlayerDetail("position", this.selectedValue);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}


