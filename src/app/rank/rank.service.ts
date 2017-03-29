import { Injectable } from '@angular/core';
import { FirebaseManager } from '../../providers/firebase-manager';
import { TeamRank, PlayerRank } from './rank.model';
import { PlayerService } from '../../app/players/player.service';
import { Player } from '../../app/players/player.model';
import { TeamService } from '../../app/teams/team.service';
import { Team } from '../../app/teams/team.model';

@Injectable()
export class RankService {
  playerRanks = [];
  teamRanks = [];
  //needRefreshTeamsRankUI = false;
  //playerRanksMap = {};
  //teamRanksMap = {};
  constructor(private fm: FirebaseManager,
    private playerService: PlayerService,
    private teamService: TeamService) {
    document.addEventListener('publicteamschanged',
      e => {
          //this.needRefreshTeamsRankUI = false;
          this.teamRanks = [];
          let sortedPublicTeams = this.fm.sortedPublicTeams;
          for (let i = 0; i < sortedPublicTeams.length; ++i) {
            let teamId = sortedPublicTeams[i].$key;
            let teamRankData = this.teamService.findOrCreateTeamAndPull(teamId);
            // let teamRankData = {
            //   id: teamId,
            //   name: sortedPublicTeams[i].name,
            //   logo: "assetsimg/none.png",
            //   totalPlayers: 0,
            //   ability: sortedPublicTeams[i].ability,
            //   popularity: sortedPublicTeams[i].popularity
            // };
            this.teamRanks.push(teamRankData);
            //easy find taemRankData
            //this.teamRanksMap[teamId] = teamRankData;
            //this.teamService.getTeamAsync(teamId);
          }
          this.fm.FireEvent('serviceteamrankschanged');
        }
      );

    // document.addEventListener('serviceteamready', e => {
    //   let teamId = e['detail'];
    //   let team = this.teamService.getTeam(teamId);
    //   let teamRankData = this.teamRanksMap[teamId];
    //   if (team && teamRankData) {
    //     teamRankData.logo = team.logo;
    //     teamRankData.totalPlayers = team.totalPlayers;
    //     teamRankData.ability = team.ability;
    //     teamRankData.popularity = team.popularity;
    //   }
    // }
    // );

    document.addEventListener('publicplayerschanged', e => {
      let sortedPublicPlayers = this.fm.sortedPublicPlayers;
      this.playerRanks = [];
      for (let i = 0; i < sortedPublicPlayers.length; ++i) {
        let playerId = sortedPublicPlayers[i].$key;
        let playerRank = this.playerService.findOrCreatePlayerAndPull(playerId);
        // playerRank.popularity = sortedPublicPlayers[i].popularity;
        // playerRank.id = id;
        this.playerRanks.push(playerRank);
        // this.playerRanksMap[id] = playerRank;
        // this.playerService.getPlayerAsync(id);
      }

      this.fm.FireEvent('serviceplayerrankschanged');
    });

    // document.addEventListener('serviceplayerready', e => {
    //   let id = e['detail'];
    //   let player = this.playerService.getPlayer(id);
    //   let playerRank = this.playerRanksMap[id];
    //   if (playerRank) {
    //     playerRank.photo = player.photo;
    //     playerRank.name = player.name;
    //     playerRank.position = player.position;
    //     playerRank.popularity = player.popularity;
    //   } 
    // });
  }

  getTeamRanksAsync(orderby, count) {
    //this.needRefreshTeamsRankUI = true;
    this.fm.getPublicTeams(orderby, count);
  }

  getPlayerRanksAsync(sortby, count) {
    this.fm.queryPublicPlayers(sortby, count);
  }
}