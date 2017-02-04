import { Injectable } from '@angular/core';
import { MatchBasic, Match } from './match.model';
import { MatchStanding } from './match.model';
import { MATCHBASICS } from './shared/mock-data/mock-match-basic';
import { MATCHSTANDINGS } from './shared/mock-data/mock-match-standing';
import { FirebaseManager } from '../../providers/firebase-manager';
import { TeamService} from '../teams/team.service';
import { Team} from '../teams/team.model';

@Injectable()
export class MatchService {
  matchesMap = {};
  teamsMap = {};

  constructor(private fm: FirebaseManager,
  private teamService : TeamService) {
    document.addEventListener('matchready', e => {
      let id = e['detail'];
      let fmMatch = this.fm.getMatch(id);
      let match = new Match();
      match.id = fmMatch.$key;
      match.tournamentId = fmMatch.tournamentId;
      match.homeId = fmMatch.homeId;
      match.awayId = fmMatch.awayId;
      match.homeScore = fmMatch.homeScore;
      match.awayScore = fmMatch.awayScore;
      match.date = fmMatch.date;
      match.time = fmMatch.time;
      let home, away;
      if (this.teamsMap[match.homeId])
        home = this.teamsMap[match.homeId];
      else {
        home = new Team();
        this.teamsMap[match.homeId] = home;
      }
      if (this.teamsMap[match.awayId])
        away = this.teamsMap[match.awayId];
      else {
        away = new Team();
        this.teamsMap[match.awayId] = away;
      }
      match.home = home;
      match.away = away;
      this.matchesMap[id] = match;
      this.teamService.getTeamAsync(match.homeId);
      this.teamService.getTeamAsync(match.awayId);
      this.fm.FireCustomEvent('servicematchready', id);
    });

    document.addEventListener('serviceteamready', e => {
      let id = e['detail'];
      let team = this.teamsMap[id];
      if (team) {
        let fmTeam = this.teamService.getTeam(id);
        team.name = fmTeam.name;
        team.logo = fmTeam.logo;
      } 
    });
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

  getMatch(id) {
    return this.matchesMap[id];
  }

  getMatchAsync(id) {
    if (this.getMatch(id))
      this.fm.FireCustomEvent('servicematchready', id);
    else
      this.fm.getMatchAsync(id);
  }
}