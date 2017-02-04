import { Injectable } from '@angular/core';
import { MatchBasic, Match } from './match.model';
import { MatchStanding } from './match.model';
import { MATCHBASICS } from './shared/mock-data/mock-match-basic';
import { MATCHSTANDINGS } from './shared/mock-data/mock-match-standing';
import { FirebaseManager } from '../../providers/firebase-manager';
import { TeamService} from '../teams/team.service';

@Injectable()
export class MatchService {
  matchesMap = {};

  constructor(private fm: FirebaseManager,
  private teamService : TeamService) {
    // document.addEventListener('matchready', e => {
    //   let id = e['detail'];
    //   let fmMatch = this.fm.getMatch(id);
    //   let match = new Match();
    //   match.id = fmMatch.$key;
    //   match.tournamentId = fmMatch.tournamentId;
    //   match.homeId = fmMatch.homeId;
    //   match.awayId = fmMatch.awayId;
    //   match.homeScore = fmMatch.homeScore;
    //   match.awayScore = fmMatch.awayScore;
    //   match.date = fmMatch.date;
    //   match.time = fmMatch.time;
    //   this.matchesMap[id] = match;
    //   this.fm.FireCustomEvent('servicematchready', id);
    // })
  }

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

  getMatchesByDate(date) {
    return this.fm.getMatchesByDate(date);
  }

  getMatchesByDateAsync(date) {
    this.fm.getMatchesByDateAsync(date);
  }
}