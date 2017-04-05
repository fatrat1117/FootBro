import { Component, ViewChild } from '@angular/core';
import { ViewController} from 'ionic-angular';

import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'

@Component({
  template: `
  <ion-header>
    <sb-modal-navbar title="NewTeam" buttonName="Create" [isEnabled]="isValid" (onFinish)="create()"></sb-modal-navbar>
  </ion-header>

  <ion-content>
    <ion-item-group>
      <!-- image -->
      <ion-item detail-push (tap)="changePhoto()">
        <h2>{{'Photo' | trans}}</h2>
        <ion-thumbnail item-right>
          <img src="assets/team-logo/team-logo.jpg">
        </ion-thumbnail>
      </ion-item>

      <!-- name -->
      <ion-item>
        <h2>{{'TeamName' | trans}}</h2>
        <ion-input #valueInput type="text" maxlength="32" clearInput [(ngModel)]="newValue" (ngModelChange)=onValueChange()>
        </ion-input>
      </ion-item>

      <!-- default -->
      <ion-item>
        <ion-label>{{'Default' | trans}}</ion-label>
        <ion-toggle [(ngModel)]="isDefault"></ion-toggle>
      </ion-item>
    </ion-item-group>
  </ion-content>
  `
})
export class NewTeamPage {
  @ViewChild('valueInput') valueInput;
  player: Player;
  newValue: string;
  isValid: boolean;
  isDefault: boolean;

  constructor(private viewCtrl: ViewController, private playerService: PlayerService) {
    this.isValid = false;
    this.isDefault = false;
  }

  ionViewDidLoad() {
    this.valueInput.setFocus();
  }

  onValueChange() {
    this.isValid = (this.newValue.trim().length != 0);
  }

  create() {
    console.log("a new team created");
    
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}


