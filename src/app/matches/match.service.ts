import { Injectable } from '@angular/core';
import { Match } from './match.model';
import { MATCHBASICS } from './shared/mock-data/mock-match-basic';
import { MATCHSTANDINGS } from './shared/mock-data/mock-match-standing';
import { FirebaseManager } from '../../providers/firebase-manager';
import { TeamService } from '../teams/team.service';
import { Team } from '../teams/team.model';
import { PlayerMatchStatsUI } from '../players/player.model';
import { PlayerService } from '../players/player.service';

@Injectable()
export class MatchService {
  matchesMap = {};
  teamMatchesMap = {};
  tournamentTableMap = {};
  eliminationMap = {};
  registeredTeamsMap = {};

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
      match.homePenalty = fmMatch.homePenalty;
      match.awayPenalty = fmMatch.awayPenalty;
      match.date = fmMatch.date;
      match.time = fmMatch.time;
      match.isHomeUpdated = fmMatch.isHomeUpdated;
      match.isAwayUpdated = fmMatch.isAwayUpdated;
      match.dataReady = true;
      match.groupId = fmMatch.groupId;
      match.informed = fmMatch.informed;
      match.colors = fmMatch.colors;
      match.updateTime = fmMatch.updateTime;
      match.home = this.teamService.findOrCreateTeam(match.homeId);
      this.fm.getTeamAsync(match.homeId);
      match.away = this.teamService.findOrCreateTeam(match.awayId);
      this.fm.getTeamAsync(match.awayId);

      match.location.lat = fmMatch.lat || 0;
      match.location.lng = fmMatch.lng || 0;
      match.location.name = fmMatch.locationName;
      match.location.address = fmMatch.locationAddress;

      this.fm.FireCustomEvent('servicematchready', id);
    });

    document.addEventListener('teammatchesready', e => {
      let result = e['detail'];
      if (this.teamMatchesMap[result.id])
        this.teamMatchesMap[result.id].splice(0);
      else
        this.teamMatchesMap[result.id] = [];
      result.matches.forEach(m => {
        let match = this.findOrCreateMatchAndPull(m.$key);
        match.time = m.time;
        this.teamMatchesMap[result.id].push(match);
      });
      this.fm.FireCustomEvent('serviceteammatchesready', result.id);
    });

    document.addEventListener('eliminationsready', e => {
      let id = e['detail'];
      let els = this.fm.getEliminations(id);
      let newEls = [];

      for (let i = 0; i < els.length; ++i) {
        let newEl: any = {};
        newEl.name = els[i].name;
        newEl.matches = [];
        if (i < els.length - 1)
          newEl.nextName = els[i + 1].name;
        for (let m in els[i].matches) {
          newEl.matches.push(m);
        }
        newEls.push(newEl);
      }

      this.eliminationMap[id] = newEls;
      this.fm.FireCustomEvent('serviceeliminationsready', id);
    });

    document.addEventListener('registeredteamsready', e => {
      let id = e['detail'];
      let teams = this.fm.getRegisteredTeams(id);
      let registeredTeams = [];
      teams.forEach(t => {
        //let team = t;
        let team = this.teamService.findOrCreateTeam(t.$key);
        this.fm.getTeamAsync(t.$key);
        registeredTeams.push(team);
      });

      console.log(registeredTeams);

      this.registeredTeamsMap[id] = registeredTeams;
      this.fm.FireCustomEvent('serviceregisteredteamsready', id);
    });
  }

  // copyParticipants(target, source) {
  //   if (source) {
  //       target.splice(0);
  //       source.forEach(p => {
  //         let copy = Object.assign({}, p);
  //         copy['player'] = this.playerService.findOrCreatePlayer(p.id);
  //         target.push(copy);
  //         this.fm.getPlayerAsync(p.id);
  //       })
  //     }
  // }

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

  findOrCreateMatchAndPull(id): Match {
    let match;
    if (this.getMatch(id))
      match = this.getMatch(id);
    else {
      match = new Match();
      match.$key = id;
      this.matchesMap[id] = match;
      this.fm.getMatchAsync(id);
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

  getMatch(id): Match {
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

  getTournamentTable(tournamentId, groupId = null) {
    let table = this.fm.getTournamentTable(tournamentId, groupId);
    let copyTable = Object.assign({}, table);
    //console.log('table', copyTable);
    let teamTables = [];
    for (let teamId in copyTable) {
      let r = Object.assign({}, table[teamId]);
      r.team = this.teamService.findOrCreateTeamAndPull(teamId);
      //console.log(r);
      teamTables.push(r);
    }
    teamTables.sort((a, b) => {
      return a.rank - b.rank;
    });
    return teamTables;
  }

  getEliminations(id) {
    return this.eliminationMap[id];
  }

  // getTournamentTableAsync(id) {
  //   if (this.getTournamentTable(id))
  //     this.fm.FireCustomEvent('servicetournamenttableready', id);
  //   else
  //     this.fm.getTournamentTableAsync(id);
  // }

  getEliminationsAsync(id) {
    if (this.getEliminations(id))
      this.fm.FireCustomEvent('serviceeliminationsready', id);
    else
      this.fm.getEliminationsAsync(id);
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

  registerLeague(teamId: string, leagueId: string) {
    this.fm.registerLeague(teamId, leagueId);
  }

  getRegisteredTeams(leagueId: string) {
    return this.registeredTeamsMap[leagueId];
  }

  getRegisteredTeamsAsync(leagueId: string) {
    if (this.getRegisteredTeams(leagueId))
      this.fm.FireCustomEvent('serviceregisteredteamsready', leagueId);
    else
      this.fm.getRegisteredTeamsAsync(leagueId);
  }

  getLeagueInfo(leagueId: string) {
    //this.fm.getLeagueRule(leagueId);
  }

  getUpdateState(match) {
    //0: no one update
    //1: home updated
    //2: away updated
    //3 both updated
    if (match.isHomeUpdated && match.isAwayUpdated)
      return 3;
    if (match.isHomeUpdated)
      return 1;
    if (match.isAwayUpdated)
      return 2;
    return 0;
  }

  attendMatch(teamId: string, matchId: string) {
    this.fm.attendMatch(teamId, matchId);
  }

  absentMatch(teamId: string, matchId: string) {
    this.fm.absentMatch(teamId, matchId);
  }

  TBDMatch(teamId: string, matchId: string) {
    this.fm.TBDMatch(teamId, matchId);
  }

  getTournaments() {
    return this.fm.getTournaments();
  }

  getTournamentsAsync() {
    this.fm.getTournamentsAsync();
  }

  computeTournamentTable(tournamentId) {
    this.fm.computeTournamentTable(tournamentId);
  }

  setJerseyColor(matchId, teamId, color) {
    this.fm.setJerseyColor(matchId, teamId, color);
  }
}