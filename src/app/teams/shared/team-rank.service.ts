import { Injectable } from '@angular/core';

import { TeamRank } from './team-rank.model';
import { TEAMRANKS } from './mock-data/mock-team-rank';

@Injectable()
export class TeamRankService {
  getTeamRanks(): Promise<TeamRank[]> {
    return Promise.resolve(TEAMRANKS);
  }
}