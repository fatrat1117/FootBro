import { Injectable } from '@angular/core';
import { FirebaseManager } from '../../providers/firebase-manager';
import { Team } from './team.model';

@Injectable()
export class TeamService {
  teamDataMap = {};

  constructor(private fm: FirebaseManager) {
    document.addEventListener('TeamDataReady', e => {
      let teamId = e['detail'];
      let team = this.fm.getTeam(teamId);
      //console.log(team);

      if (team) {
        let teamData = new Team();
        teamData.id = team.$key;
        teamData.logo = team['basic-info'].logo;
        teamData.name = team['basic-info'].name;
        teamData.totalPlayers = team['basic-info'].totalPlayers;
        
        this.teamDataMap[teamId] = teamData;
        let teamPublic = this.fm.getTeamPublic(teamId);
        if (teamPublic) {
          teamData.ability = teamPublic.ability;
          teamData.popularity = teamPublic.popularity;
        }
        else
          this.fm.getTeamPublicAsync(teamId);

        this.fm.getTeamStatsAsync(teamId);
        this.fm.FireCustomEvent('ServiceMyTeamDataReady', teamId);
      }
    }
    );

    document.addEventListener('TeamPublicDataReady', e => {
      let teamId = e['detail'];
      let teamData = this.teamDataMap[teamId];
      let teamPublic = this.fm.getTeamPublic(teamId);
      if (teamData && teamPublic) {
        teamData.ability = teamPublic.ability;
        teamData.popularity = teamPublic.popularity;
      }
    });

    document.addEventListener('TeamStatsDataReady', e => {
      let teamId = e['detail'];
      let teamData = this.teamDataMap[teamId];
      let teamStats = this.fm.getTeamStats(teamId);
      if (teamData && teamStats) {
        teamData.last_5 = teamStats.last_5;
        teamData.last_15 = teamStats.last_15;
        teamData.last_30 = teamStats.last_30;
        teamData.overall = teamStats.overall;
      }
      //console.log(teamData);
    });
  }

  getTeamAsync(id) {
    this.fm.getTeamAsync(id);
  }

  getTeam(id) {
    return this.teamDataMap[id];
  }

  increasePopularity(id) {
    this.fm.increaseTeamPopularity(id);
  }
}