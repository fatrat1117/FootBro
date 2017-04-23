import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController } from 'ionic-angular';
import { PlayerService } from '../../app/players/player.service';
import { TeamService } from '../../app/teams/team.service';
import { Localization } from '../../providers/localization'
import { OneSignalManager } from '../../providers/onesignal-manager'
declare var sprintf: any;

@Component({
  template: `
    <ion-list>
      <button ion-item (click)="removeFromTeam()" *ngIf="canShowRemoveFromTeam()">{{'removefromteam' | trans}}</button>
      <button ion-item (click)="appointAdmin()" *ngIf="canShowAppointAdmin()">{{'appointadmin' | trans}}</button>
      <button ion-item (click)="removeAdmin()" *ngIf="canShowRemoveAdmin()">{{'removeadmin' | trans}}</button>
      <button ion-item (click)="PromoteToCaptain()" *ngIf="canPromoteToCaptain()">{{'PromoteToCaptain' | trans}}</button>
    </ion-list>
  `
})
export class ManagePlayerPopover {
  teamId;
  team;
  teamPlayer;
  constructor(public viewCtrl: ViewController,
    params: NavParams,
    private playerService: PlayerService,
    private teamService: TeamService,
    private alertCtrl: AlertController,
    private local: Localization,
    private osm: OneSignalManager) {
    this.teamId = params.get('teamId');
    this.teamPlayer = params.get('teamPlayer');
    this.team = this.teamService.getTeam(this.teamId);
  }

  close(bRefreshUI) {
    this.viewCtrl.dismiss(bRefreshUI);
  }

  appointAdmin() {
    this.playerService.appointTeamAdmin(this.teamId, this.teamPlayer.id);
    this.close(true);
  }

  removeAdmin() {
    this.playerService.removeTeamAdmin(this.teamId, this.teamPlayer.id);
    this.close(true);
  }

  canShowAppointAdmin() {
    return this.playerService.amICaptainOf(this.teamId) && !this.playerService.isCaptainOrAdmin(this.teamPlayer.id, this.teamId);
  }

  canShowRemoveAdmin() {
    return this.playerService.amICaptainOf(this.teamId) && this.playerService.isTeamAdmin(this.teamPlayer.id, this.teamId);
  }

  canPromoteToCaptain() {
    return this.playerService.amICaptainOf(this.teamId) && !this.playerService.isCaptain(this.teamPlayer.id, this.teamId);
  }

  canShowRemoveFromTeam() {
    return this.playerService.amICaptainOrAdmin(this.teamId);
  }

  doRemoveFromTeam() {
    this.playerService.removeFromTeam(this.teamPlayer.id, this.teamId);
    if (this.teamPlayer.pushId) {
      let enMsg = sprintf('you have been removed from %s',
        this.team.name
      );

      let chMsg = sprintf('你已经被移除%s',
        this.team.name
      );

      let pushMsg = { 'en': enMsg, 'zh-Hans': chMsg };
      this.osm.postNotification(pushMsg, [this.teamPlayer.pushId]);
    }
    this.close(true);
  }

  removeFromTeam() {
    this.alertCtrl.create({
      message: sprintf(this.local.getString("confirmremove"), this.teamPlayer.name, this.team.name),
      buttons: [
        {
          text: this.local.getString('Cancel'),
          handler: () => {
          }
        },
        {
          text: this.local.getString('OK'),
          handler: () => {
            this.doRemoveFromTeam();
          }
        }]
    }).present();
  }
}