import { Injectable } from '@angular/core';

import { TEAMRANKS } from './mock-data/mock-team-rank';

@Injectable()
export class TeamRankService {
  getTeamRanks(): Promise<any[]> {
    return new Promise<any[]>(resolve =>
    setTimeout(resolve, 2000)) // delay 2 seconds
    .then(() => Promise.resolve(TEAMRANKS));
  }
}