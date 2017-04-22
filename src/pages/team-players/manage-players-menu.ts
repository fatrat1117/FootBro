import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { PlayerService } from '../../app/players/player.service';

@Component({
  template: `
    <ion-list>
      <button ion-item (click)="close()">{{'removefromteam' | trans}}</button>
      <button ion-item (click)="appointAdmin()">{{'appointadmin' | trans}}</button>
      <button ion-item (click)="removeAdmin()">{{'removeadmin' | trans}}</button>
      <button ion-item (click)="close()">{{'Quit' | trans}}</button>
      <button ion-item (click)="close()">{{'PromoteToCaptain' | trans}}</button>
    </ion-list>
  `
})
export class ManagePlayerPopover {
  teamId;
  playerId;
  constructor(public viewCtrl: ViewController, 
  params : NavParams,
  private playerService: PlayerService) {
    this.teamId = params.get('teamId');
    this.playerId = params.get('playerId');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  appointAdmin() {
    this.playerService.appointTeamAdmin(this.teamId, this.playerId);
    this.close();
  }

  removeAdmin() {
    this.playerService.removeTeamAdmin(this.teamId, this.playerId);
    this.close();
  }
}