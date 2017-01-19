import { Injectable } from '@angular/core';
import { FirebaseManager } from '../../providers/firebase-manager';
import { MyTeam } from './my-team.model';

@Injectable()
export class MyTeamService {
  teamDataMap = {};

  constructor(private fm: FirebaseManager) {
    document.addEventListener('TeamDataReady', e => {
      let teamId = e['detail'];
      let team = this.fm.getTeam(teamId);
      //console.log(team);

      if (team) {
        let teamData: MyTeam = {
          id: team.$key,
          popularity: 1,
          logo: team['basic-info'].logo,
          name: team['basic-info'].name,
          ability: 1,
          totalPlayers: team['basic-info'].totalPlayers
        }
        this.teamDataMap[teamId] = teamData;
        let teamPublic = this.fm.getTeamPublic(teamId);
        if (teamPublic) {
          teamData.ability = teamPublic.ability;
          teamData.popularity = teamPublic.popularity;
        }
        else
          this.fm.getTeamPublicAsync(teamId);
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

  }

  getMyTeamAsync(id) {
    this.fm.getTeamAsync(id);
  }

  getMyTeam(id) {
    return this.teamDataMap[id];
  }

  increasePopularity(id) {
    this.fm.increaseTeamPopularity(id);
  }
}