import { Injectable } from '@angular/core';

import { TEAMRANKS } from './mock-data/mock-team-rank';

@Injectable()
export class TeamRankService {
  getTeamRanks(): Promise<any[]> {
    return new Promise<any[]>(resolve =>
      setTimeout(resolve, 2000)) // delay 2 seconds
      .then(() => Promise.resolve(TEAMRANKS));
  }

  getMoreTeamRanks(): Promise<any[]> {
    return new Promise<any[]>(resolve => {
              TEAMRANKS.push({
          id: "-KL1a8zTfCXDapavsN_L",
          name: "test" + TEAMRANKS.length,
          logo: "assets/team-logo/team_logo.jpg",
          totalPlayers: TEAMRANKS.length,
          ability: TEAMRANKS.length * 50,
          popularity: TEAMRANKS.length * 10
        });
      setTimeout(resolve, 2000);
    }).then(() => Promise.resolve(TEAMRANKS));
  }
}