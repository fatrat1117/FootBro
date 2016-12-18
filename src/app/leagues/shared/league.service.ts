import { Injectable } from '@angular/core';

import { LeagueBasic } from './league.model';

import { LEAGUEBASICS } from './mock-data/mock-league-basic';

@Injectable()
export class LeagueService {
  getLeagueBasics(leagueId: string): Promise<LeagueBasic[]> {
    return Promise.resolve(LEAGUEBASICS);
  }
}