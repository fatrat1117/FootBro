import { Injectable } from '@angular/core';

import { MatchBasic } from './match.model';
import { MatchStanding } from './match.model';

import { MATCHDATES } from './mock-data/mock-match-date';
import { MATCHBASICS } from './mock-data/mock-match-basic';
import { MATCHSTANDINGS } from './mock-data/mock-match-standing';

@Injectable()
export class MatchService {
  getMatchDates(leagueId: string): Promise<number[]> {
    return Promise.resolve(MATCHDATES);
  }

  getMatchBasics(date: string): Promise<MatchBasic[]> {
    return Promise.resolve(MATCHBASICS);
  }

  getMatchStandings(leagueId: string): Promise<MatchStanding[]> {
    return Promise.resolve(MATCHSTANDINGS);
  }
}