import { Injectable } from '@angular/core';
import { Match } from './match.model';
import { MATCHBASICS } from './shared/mock-data/mock-match-basic';
import { MATCHSTANDINGS } from './shared/mock-data/mock-match-standing';
import { FirebaseManager } from '../../providers/firebase-manager';
import { TeamService } from '../teams/team.service';
import { Team } from '../teams/team.model';
import { PlayerMatchData } from '../players/player.model';
import { PlayerService } from '../players/player.service';

@Injectable()
export class MatchService {
  matchesMap = {};
  teamMatchesMap = {};
  tournamentTableMap = {};

  constructor(private fm: FirebaseManager,
    private teamService: TeamService,
    private playerService: PlayerService) {
    document.addEventListener('matchready', e => {
      let id = e['detail'];
      let fmMatch = this.fm.getMatch(id);
      let match = this.findOrCreateMatch(id);
      match.id = fmMatch.$key;
      match.tournamentId = fmMatch.tournamentId;
      match.homeId = fmMatch.homeId;
      match.awayId = fmMatch.awayId;
      match.homeScore = fmMatch.homeScore;
      match.awayScore = fmMatch.awayScore;
      match.date = fmMatch.date;
      match.time = fmMatch.time;

      // let home, away;
      // if (this.teamsMap[match.homeId])
      //   home = this.teamService.findOrCreateTeam(match.homeId);
      // else {
      //   home = new Team();
      //   this.teamsMap[match.homeId] = home;
      // }
      // if (this.teamsMap[match.awayId])
      //   away = this.teamsMap[match.awayId];
      // else {
      //   away = new Team();
      //   this.teamsMap[match.awayId] = away;
      // }
      match.home = this.teamService.findOrCreateTeam(match.homeId);
      this.fm.getTeamAsync(match.homeId);
      match.away = this.teamService.findOrCreateTeam(match.awayId);
      this.fm.getTeamAsync(match.awayId);

      match.location.lat = fmMatch.lat || 0;
      match.location.lng = fmMatch.lng || 0;
      match.location.name = fmMatch.locationName;
      match.location.address = fmMatch.locationAddress;

      this.copyParticipants(match.homeParticipants, fmMatch.homeParticipants);
      this.copyParticipants(match.awayParticipants, fmMatch.awayParticipants);

      //console.log(match);
      this.fm.FireCustomEvent('servicematchready', id);
    });

    // document.addEventListener('serviceteamready', e => {
    //   let id = e['detail'];
    //   let team = this.teamService.getTeam(id);
    //   if (team) {
    //     let fmTeam = this.teamService.getTeam(id);
    //     team.name = fmTeam.name;
    //     team.logo = fmTeam.logo;
    //   }
    // });

    document.addEventListener('teammatchesready', e => {
      let result = e['detail'];
      let matches = [];
      this.teamMatchesMap[result.id] = matches;
      result.matches.forEach(m => {
        let match = this.findOrCreateMatch(m.$key);
        matches.push(match);
        this.fm.getMatchAsync(m.$key);
      });
      this.fm.FireCustomEvent('serviceteammatchesready', result.id);
    });

    document.addEventListener('tournamenttableready', e => {
      let id = e['detail'];
      let table = this.fm.getTournamentTable(id);
      table.forEach(r => {
        let rank = r;
        rank['team'] = this.teamService.findOrCreateTeam(r.id);
        this.fm.getTeamAsync(r.id);
      });
      this.tournamentTableMap[id] = table;
      this.fm.FireCustomEvent('servicetournamenttableready', id);
    });
  }

  copyParticipants(target, source) {
    if (source) {
        target.splice(0);
        source.forEach(p => {
          let copy = Object.assign({}, p);
          copy['player'] = this.playerService.findOrCreatePlayer(p.id);
          target.push(copy);
          this.fm.getPlayerAsync(p.id);
        })
      }
  }
  
  findOrCreateMatch(id): Match {
    let match;
    if (this.matchesMap[id])
      match = this.matchesMap[id];
    else {
      match = new Match();
      match.$key = id;
      this.matchesMap[id] = match;
    }
    return match;
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

  getMatchesByDateAsync(date, tournamentId) {
    this.fm.getMatchesByDateAsync(date, tournamentId);
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

  getTeamMatches(id) {
    return this.teamMatchesMap[id];
  }

  getTeamMatchesAsync(id) {
    this.fm.getTeamMatchesAsync(id);
  }

  afTournamentList() {
    return this.fm.afTournamentList();
  }

  getTournamentTable(id) {
    return this.tournamentTableMap[id];
  }

  getTournamentTableAsync(id) {
    if (this.getTournamentTable(id))
      this.fm.FireCustomEvent('servicetournamenttableready', id);
    else
      this.fm.getTournamentTableAsync(id);
  }

  scheduleMatch(matchObj) {
    this.fm.scheduleMatch(matchObj);
  }

  deleteMatch(id) {
    this.fm.deleteMatch(id);
  }

  updateMatch(id, matchObj) {
    this.fm.updateMatch(id, matchObj);
  }
}