import { Component } from '@angular/core';
import { Clipboard } from 'ionic-native';
import { NavController, NavParams, ViewController, PopoverController, AlertController } from 'ionic-angular';
import { PlayerService } from '../../app/players/player.service';
import { TeamService } from '../../app/teams/team.service';
import { ManagePlayerPopover } from './manage-players-menu';
import { Localization } from '../../providers/localization'
declare var sprintf: any;

@Component({
  templateUrl: 'team-players.html',
  selector: 'team-players',
})
export class TeamPlayersPage {
  //showDetail: boolean;
  teamId: string;
  team;
  players: any[];
  onTeamPlayersReady;
  invitationCode;
  constructor(private nav: NavController,
    navParams: NavParams,
    private playersService: PlayerService,
    private viewCtrl: ViewController,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private loc: Localization,
    private teamSerive: TeamService) {
    this.teamId = navParams.get('teamId');
    this.team = this.teamSerive.getTeam(this.teamId);
    if (this.playersService.isAuthenticated()) {
      let id = this.playersService.selfId() + "%" + this.teamId;
      this.invitationCode = btoa(id);
    }
    this.refreshPlayers();
  }

  refreshPlayers() {
    this.players = this.playersService.getTeamPlayers2(this.teamId);
  }

  popupManageMenu(myEvent, player) {
    let popover = this.popoverCtrl.create(ManagePlayerPopover, { teamId: this.teamId, teamPlayer: player });
    popover.onDidDismiss(e => {
      if (e) {
        this.refreshPlayers();
      }
    })
    popover.present({ ev: myEvent });
  }

  canShowSettings(playerId) {
    if (this.playersService.selfId() === playerId)
      return false;

    if (this.playersService.isCaptain(playerId, this.teamId))
      return false;

    if (this.playersService.amICaptainOrAdmin(this.teamId))
      return true;

    return false;
  }

  //打开邀请
  invitePlayer() {
    //let id = this.selfId + "%" + this.team.id;

    let msg = sprintf(this.loc.getString('teaminvitation'), this.playersService.myself().name, this.team.name, this.invitationCode);
    Clipboard.copy(msg);
    let alert = this.alertCtrl.create({
      title: this.loc.getString('SoccerBro'),
      message: this.loc.getString('teamInvitationCopied'),
      buttons: [this.loc.getString('OK')]
    });
    alert.present();
  }

  canShowInvite() {
    return this.playersService.amIMemberOfTeam(this.teamId);
  }
}
