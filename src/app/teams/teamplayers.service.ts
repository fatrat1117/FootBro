import { Injectable } from '@angular/core';
import { TeamService } from './team.service';
import { FirebaseManager } from '../../providers/firebase-manager';
import { PlayerService } from '../players/player.service';
import { Player } from '../players/player.model';

@Injectable()
export class TeamPlayersService {
  teamPlayersMap = {};
  playerMap = {};
  bRefresh = false;

  constructor(private fm: FirebaseManager,
    private teamService: TeamService,
    private playerService: PlayerService) {
    document.addEventListener('serviceteamready', e => {
      if (this.bRefresh) {

        let id = e['detail'];
        let team = this.teamService.getTeam(id);

        let players;
        if (this.teamPlayersMap[id]) {
          players = this.teamPlayersMap[id];
          players = [];
        }
        else {
          players = [];
          this.teamPlayersMap[id] = players;
        }

        for (let pId in team.players) {
          let player;
          if (this.playerMap[pId]) {
            player = this.playerMap[pId];
          }
          else {
            player = new Player();
            this.playerMap[pId] = player;
            this.playerService.getPlayerAsync(pId);
          }
          players.push(player);
        }
        this.bRefresh = false;
        this.fm.FireCustomEvent('serviceteamplayersready', id);
      }
    });

    document.addEventListener('serviceplayerready', e => {
      let id = e['detail'];
      let player = this.playerService.getPlayer(id);
      let cachedPlayer = this.playerMap[id];
      if (cachedPlayer) {
        if (player.name) {
          cachedPlayer.name = player.name;
          cachedPlayer.photo = player.photo;
        }
        else {
          cachedPlayer.name = "John Doe";
          cachedPlayer.photo = "assets/img/none.png";
        }
      }
    });
  }

  getTeamPlayers(id) {
    return this.teamPlayersMap[id];
  }

  getTeamPlayersAsync(id) {
    this.bRefresh = true;

    if (this.getTeamPlayers(id))
      this.fm.FireCustomEvent('serviceteamplayersready', id);
    else
      this.teamService.getTeamAsync(id);
  }
}