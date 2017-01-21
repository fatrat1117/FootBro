import { Injectable } from '@angular/core';
import { FirebaseManager } from '../../../providers/firebase-manager'
// export const PLAYERRANKS: any[] = [
//   {
//     id: "-KL1a8zTfCXDapavsN_L",
//     name: "Li Jixiang",
//     photoURL: "assets/player-photo/player_photo.jpg",
//     position: 'cf',
//     popularity: 12
//   },
//   {
//     id: "-KL1a8zTfCXDapavsN_L",
//     name: "Wang Tian Yi",
//     photoURL: "assets/player-photo/player_photo.jpg",
//     position: 'dmf',
//     popularity: 13
//   },
//   {
//     id: "-KL1a8zTfCXDapavsN_L",
//     name: "Zeng Lei",
//     photoURL: "assets/player-photo/player_photo.jpg",
//     position: 'gk',
//     popularity: 11
//   },
//   {
//     id: "-KL1a8zTfCXDapavsN_L",
//     name: "Lu Angxiao",
//     photoURL: "assets/player-photo/player_photo.jpg",
//     position: 'amf',
//     popularity: 15
//   },
//   {
//     id: "-KL1a8zTfCXDapavsN_L",
//     name: "Li Hao",
//     photoURL: "assets/player-photo/player_photo.jpg",
//     position: 'cb',
//     popularity: 10
//   },
// ];

@Injectable()
export class RankService {
  playerRanks = [];
  teamRanks = [];

  needRefreshTeamsRankUI = false;
  //teamRankRefreshMap = {};
  teamRankMap = {};
  constructor(private fm: FirebaseManager) {
    document.addEventListener('PublicTeamsChanged',
      e => {
        if (this.needRefreshTeamsRankUI) {
          console.log('needRefreshTeamsRankUI');
          this.needRefreshTeamsRankUI = false;
          this.teamRanks = [];
          let sortedPublicTeams = this.fm.sortedPublicTeams;
          for (let i = 0; i < sortedPublicTeams.length; ++i) {
            let teamId = sortedPublicTeams[i].$key;
            let teamRankData = {
              id: teamId,
              name: sortedPublicTeams[i].name,
              logo: "assets/team-logo/team_logo.jpg",
              totalPlayers: 201,
              ability: sortedPublicTeams[i].ability,
              popularity: sortedPublicTeams[i].popularity
            };
            this.teamRanks.push(teamRankData);
            //easy find taemRankData
            this.teamRankMap[teamId] = teamRankData;
            //nneed to refresh team rank
            //this.teamRankRefreshMap[teamId] = true;
            let cachedTeam = this.fm.getTeam(teamId);
            if (cachedTeam) {
              teamRankData.logo = cachedTeam['basic-info'].logo;
              teamRankData.totalPlayers = cachedTeam['basic-info'].totalPlayers;
            }
            else 
              this.fm.getTeamAsync(teamId);
          }
          this.fm.FireEvent('ServiceTeamRankChanged');
        }
      });

      document.addEventListener('TeamDataReady', e => {
        let teamId = e['detail'];
        //if (this.teamRankRefreshMap[teamId]) {
        //  this.teamRankRefreshMap[teamId] = false;
          let team = this.fm.getTeam(teamId);
          //console.log(team);
          let teamRankData = this.teamRankMap[teamId];
          if (team && teamRankData) {
            teamRankData.logo = team['basic-info'].logo;
            teamRankData.totalPlayers = team['basic-info'].totalPlayers;
          }
        }
      );

      document.addEventListener('teampublicdataready', e => {
        let teamId = e['detail'];
        let team = this.fm.getTeamPublic(teamId);
        let teamRankData = this.teamRankMap[teamId];
          if (team && teamRankData) {
            teamRankData.ability = team.ability;
            teamRankData.popularity = team.popularity;
          }
        //console.log(teamRankData);
      });
  }

getTeamRankAsync(orderby, count) {
  this.needRefreshTeamsRankUI = true;
  this.fm.queryPublicTeams(orderby, count);
  //return this.teamRanks;
}

  getTeamPublics(): Promise<any[]> {
    return new Promise<any[]>(resolve => {
      if (0 === this.teamRanks.length) {
        //pull from firebase
      }
      else 
        resolve(this.teamRanks);
    }
    );
  }
  
  getPlayerRanks(): Promise<any[]> {
    return new Promise<any[]>(resolve =>
      setTimeout(resolve, 1000))
      .then(() => Promise.resolve(this.playerRanks));
  }

  getMorePlayerRanks(): Promise<any[]> {
    return new Promise<any[]>(resolve => {
      setTimeout(resolve, 1000);
    //   for (let i = 0; i < 10; ++i) {
    //     PLAYERRANKS.push({
    //       id: "-KL1a8zTfCXDapavsN_L",
    //       name: "Li Jixiang" + i,
    //       photoURL: "assets/player-photo/player_photo.jpg",
    //       position: 'cf',
    //       popularity: PLAYERRANKS.length
    //     })
    //   }
    })
    .then(() => Promise.resolve(this.playerRanks));
  }
}