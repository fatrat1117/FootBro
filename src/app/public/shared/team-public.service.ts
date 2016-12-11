import { Injectable } from '@angular/core';

import { TEAMPUBLICS } from './mock-data/mock-team-public';

@Injectable()
export class TeamPublicService {
  getTeamPublics(): Promise<any[]> {
    return new Promise<any[]>(resolve =>
      setTimeout(resolve, 2000)) // delay 2 seconds
      .then(() => Promise.resolve(TEAMPUBLICS));
  }

  getMoreTeamRanks(): Promise<any[]> {
    return new Promise<any[]>(resolve => {
              TEAMPUBLICS.push({
          id: "-KL1a8zTfCXDapavsN_L",
          name: "test" + TEAMPUBLICS.length,
          logo: "assets/team-logo/team_logo.jpg",
          totalPlayers: TEAMPUBLICS.length,
          ability: TEAMPUBLICS.length * 50,
          popularity: TEAMPUBLICS.length * 10
        });
      setTimeout(resolve, 2000);
    }).then(() => Promise.resolve(TEAMPUBLICS));
  }
}