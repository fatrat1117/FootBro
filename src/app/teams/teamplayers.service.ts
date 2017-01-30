import { Injectable } from '@angular/core';
import { TeamService } from './team.service';
import { FirebaseManager } from '../../providers/firebase-manager';
import { PlayerService } from '../players/player.service';

@Injectable()
export class TeamPlayersService {
  teamPlayersMap = {};

  constructor(private fm: FirebaseManager,
    private teamService: TeamService,
    private PlayerService: PlayerService) {
      document.addEventListener('serviceteamready', e => {
        let id = e['detail'];
        let team = this.teamService.getTeam(id);
        let players = [];
        console.log(team.players);
        this.fm.FireCustomEvent('serviceteamplayersready', id);
      });
  }

  getTeamPlayers(id) {
    return this.teamPlayersMap[id];
  }

  getTeamPlayersAsync(id) {
    if (this.getTeamPlayers(id))
      this.fm.FireCustomEvent('serviceteamplayersready', id);
    else
      this.teamService.getTeamAsync(id);
  }
}