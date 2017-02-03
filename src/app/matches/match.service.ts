import { Injectable } from '@angular/core';
import { MatchBasic } from './match.model';
import { MatchStanding } from './match.model';
import { MATCHBASICS } from './shared/mock-data/mock-match-basic';
import { MATCHSTANDINGS } from './shared/mock-data/mock-match-standing';
import { FirebaseManager } from '../../providers/firebase-manager';

@Injectable()
export class MatchService {
  constructor(private fm: FirebaseManager) {

  }
  // getMatchDates(leagueId: string): Promise<number[]> {
  //   return Promise.resolve(MATCHDATES);
  // }

  getMatchBasics(date: string): Promise<MatchBasic[]> {
    return Promise.resolve(MATCHBASICS);
  }

  getMatchStandings(leagueId: string): Promise<MatchStanding[]> {
    return Promise.resolve(MATCHSTANDINGS);
  }

  getMatchDatesAsync(id) {
    this.fm.getMatchDatesAsync(id);
  }

  getMatchDates(id) {
    return this.fm.getMatchDates(id);
  }
}