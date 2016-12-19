import { Injectable } from '@angular/core';

import { TeamBasic, TeamDetail } from './team.model';
import { TEAMS } from './mock-data/mock-team';

@Injectable()
export class TeamService {
  getSelfBasic(): Promise<TeamBasic> {
    return Promise.resolve(TEAMS[0].basic);
  }

  getTeamBasic(id: string): Promise<TeamBasic> {
    return Promise.resolve(TEAMS[0].basic);
  }

  getTeamDetail(id: string): Promise<TeamDetail> {
    return Promise.resolve(TEAMS[0].detail);
  }
}