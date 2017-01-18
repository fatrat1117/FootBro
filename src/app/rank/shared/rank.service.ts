import { Injectable } from '@angular/core';
import { FirebaseManager } from '../../../providers/firebase-manager'

// export const TEAMRANKS: any[] = [
//   {
//     id: "-KL1a8zTfCXDapavsN_L",
//     name: "STK Everpioneer FC",
//     logo: "assets/team-logo/team_logo.jpg",
//     totalPlayers: 20,
//     ability: 1000,
//     popularity: 110
//   },
//   {
//     id: "-KL1a8zTfCXDapavsN_L",
//     name: "Test 2",
//     logo: "assets/team-logo/team_logo.jpg",
//     totalPlayers: 20,
//     ability: 1100,
//     popularity: 100
//   },
//   {
//     id: "-KL1a8zTfCXDapavsN_L",
//     name: "Test 3",
//     logo: "assets/team-logo/team_logo.jpg",
//     totalPlayers: 20,
//     ability: 1120,
//     popularity: 101
//   },
//   {
//     id: "-KL1a8zTfCXDapavsN_L",
//     name: "Test 1",
//     logo: "assets/team-logo/team_logo.jpg",
//     totalPlayers: 201,
//     ability: 1111,
//     popularity: 23
//   }
// ];

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
  teamRanks = [
  {
    id: "-KL1a8zTfCXDapavsN_L",
    name: "STK Everpioneer FC",
    logo: "assets/team-logo/team_logo.jpg",
    totalPlayers: 20,
    ability: 1000,
    popularity: 110
  },
  {
    id: "-KL1a8zTfCXDapavsN_L",
    name: "Test 2",
    logo: "assets/team-logo/team_logo.jpg",
    totalPlayers: 20,
    ability: 1100,
    popularity: 100
  },
  {
    id: "-KL1a8zTfCXDapavsN_L",
    name: "Test 3",
    logo: "assets/team-logo/team_logo.jpg",
    totalPlayers: 20,
    ability: 1120,
    popularity: 101
  },
  {
    id: "-KL1a8zTfCXDapavsN_L",
    name: "Test 1",
    logo: "assets/team-logo/team_logo.jpg",
    totalPlayers: 201,
    ability: 1111,
    popularity: 23
  }
];

  needRefreshTeamsRankUI = false;
  constructor(private fm: FirebaseManager) {
    document.addEventListener('PublicTeamsChanged',
      e => {
        if (this.needRefreshTeamsRankUI) {
          console.log('needRefreshTeamsRankUI');
          this.needRefreshTeamsRankUI = false;
          this.teamRanks = [];
          let sortedPublicTeams = this.fm.sortedPublicTeams;
          for (let i = 0; i < sortedPublicTeams.length; ++i) {
            this.teamRanks.push({
              id: sortedPublicTeams[i].$key,
              name: sortedPublicTeams[i].name,
              logo: "assets/team-logo/team_logo.jpg",
              totalPlayers: 201,
              ability: sortedPublicTeams[i].ability,
              popularity: sortedPublicTeams[i].popularity
            })
          }
          console.log('TeamRankChanged');
          let event = new Event('TeamRankChanged');
          document.dispatchEvent(event);
        }
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

  getMoreTeamRanks(): Promise<any[]> {
    return new Promise<any[]>(resolve => {
      setTimeout(resolve, 2000);
      // TEAMRANKS.push({
      //   id: "-KL1a8zTfCXDapavsN_L",
      //   name: "test" + TEAMRANKS.length,
      //   logo: "assets/team-logo/team_logo.jpg",
      //   totalPlayers: TEAMRANKS.length,
      //   ability: TEAMRANKS.length * 50,
      //   popularity: TEAMRANKS.length * 10
      // }, {
      //     id: "-KL1a8zTfCXDapavsN_L",
      //     name: "test" + TEAMRANKS.length,
      //     logo: "assets/team-logo/team_logo.jpg",
      //     totalPlayers: TEAMRANKS.length,
      //     ability: TEAMRANKS.length * 50,
      //     popularity: TEAMRANKS.length * 10
      //   }, {
      //     id: "-KL1a8zTfCXDapavsN_L",
      //     name: "test" + TEAMRANKS.length,
      //     logo: "assets/team-logo/team_logo.jpg",
      //     totalPlayers: TEAMRANKS.length,
      //     ability: TEAMRANKS.length * 50,
      //     popularity: TEAMRANKS.length * 10
      //   });
    }).then(() => Promise.resolve(this.teamRanks));
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