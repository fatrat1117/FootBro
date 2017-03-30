import { Component } from '@angular/core';
import { NavParams, ModalController, ViewController} from 'ionic-angular'
import { EditSquadPage } from '../edit-squad/edit-squad';
import { Match } from '../../app/matches/match.model';
import { Team } from '../../app/teams/team.model'
import { TeamService } from '../../app/teams/team.service'
import { PlayerService } from '../../app/players/player.service'

@Component({
  selector: 'page-manage-squad',
  templateUrl: 'manage-squad.html'
})
export class ManageSquadPage {
  teamId;
  match = new Match();
  team;
  selectMode;
  constructor(params: NavParams,
  private modal: ModalController,
  private teamService: TeamService,
  private playerService: PlayerService,
  private viewCtrl: ViewController) {
    this.teamId = params.get('teamId');
    this.selectMode = params.get('selectMode');
    this.playerService.getTeamPlayersAsync(this.teamId);
    this.teamService.getTeamAsync(this.teamId, false, true);
    this.team = this.teamService.getTeam(this.teamId);
    this.match.id = "nonexists";
  }

  createSquad() {
    this.modal.create(EditSquadPage, { match: this.match, teamId: this.teamId, teamMode: true }).present();
  }

  onClickSquad(squad) {
    if (this.selectMode) {
      this.viewCtrl.dismiss(squad);
    }
    else
      this.modal.create(EditSquadPage, { match: this.match, teamId: this.teamId, teamMode: true, squadId: squad.$key }).present();
  }

  deleteSquad(squadId) {
    this.teamService.deleteTeamSquad(this.teamId, squadId);
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
