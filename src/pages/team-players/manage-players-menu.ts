import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { PlayerService } from '../../app/players/player.service';

@Component({
  template: `
    <ion-list>
      <button ion-item (click)="close()">{{'removefromteam' | trans}}</button>
      <button ion-item (click)="appointAdmin()" *ngIf="canShowAppointAdmin()">{{'appointadmin' | trans}}</button>
      <button ion-item (click)="removeAdmin()" *ngIf="canShowRemoveAdmin()">{{'removeadmin' | trans}}</button>
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

  close(bRefreshUI) {
    this.viewCtrl.dismiss(bRefreshUI);
  }

  appointAdmin() {
    this.playerService.appointTeamAdmin(this.teamId, this.playerId);
    this.close(true);
  }

  removeAdmin() {
    this.playerService.removeTeamAdmin(this.teamId, this.playerId);
    this.close(true);
  }

  canShowAppointAdmin() {
    return !this.playerService.isCaptainOrAdmin(this.playerId, this.teamId);
  }

  canShowRemoveAdmin() {
    return this.playerService.isTeamAdmin(this.playerId, this.teamId);
  }
}