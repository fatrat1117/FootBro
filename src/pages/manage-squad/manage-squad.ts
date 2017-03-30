import { Component } from '@angular/core';
import { NavParams, ModalController} from 'ionic-angular'
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
  constructor(params: NavParams,
  private modal: ModalController,
  private teamService: TeamService,
  private playerService: PlayerService) {
    this.teamId = params.get('teamId');
    this.playerService.getTeamPlayersAsync(this.teamId);
    this.teamService.getTeamAsync(this.teamId, false, true);
    this.team = this.teamService.getTeam(this.teamId);
    this.match.id = "nonexists";
  }

  ionViewDidLoad() {

  }

  ionViewWillUnload() {

  }  

  createSquad() {
    this.modal.create(EditSquadPage, { match: this.match, teamId: this.teamId, teamMode: true }).present();
  }

  openEditSquadPage(squadId) {
    this.modal.create(EditSquadPage, { match: this.match, teamId: this.teamId, teamMode: true, squadId: squadId }).present();
  }

  deleteSquad(squadId) {
    this.teamService.deleteTeamSquad(this.teamId, squadId);
  }
}
