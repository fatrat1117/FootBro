import { Injectable } from '@angular/core';

import { MatchBasic } from './match.model';

import { MATCHDATES } from './mock-data/mock-match-date';
import { MATCHBASICS } from './mock-data/mock-match-basic';

@Injectable()
export class MatchService {
  getMatchDates(id: string): Promise<number[]> {
    return Promise.resolve(MATCHDATES);
  }

  getMatchBasics(date: string): Promise<MatchBasic[]> {
    return Promise.resolve(MATCHBASICS);
  }
}