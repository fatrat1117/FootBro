import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { FirebaseManager } from '../../providers/firebase-manager';
import { Team } from './team.model';

  @Injectable()
export class TeamService {
  teamDataMap = {};
  allTeams = [];
  playerTeamsMap = {};
  bRefreshPlayerTeams = false;

  constructor(private fm: FirebaseManager,
  public events: Events) {
    document.addEventListener('teamready', e => {
      let teamId = e['detail'];
      let team = this.fm.getTeam(teamId);

      if (team) {
        let teamData = this.findOrCreateTeam(team.$key);

        teamData.id = team.$key;
        teamData.logo = team['basic-info'].logo;
        teamData.name = team['basic-info'].name;
        teamData.captain = team['basic-info'].captain;
        teamData.players = team.players;
        teamData.points = team.points;
        teamData.photoLarge = team.photoLarge || "assets/img/team/court.png";
        if (!teamData.points)
          teamData.points = 0;
        if (team.players)
          teamData.totalPlayers = Object.keys(team.players).length;
        else
          teamData.totalPlayers = 0;

        let teamPublic = this.fm.getTeamPublic(teamId);
        if (teamPublic) {
          teamData.ability = teamPublic.ability || 1000;
          teamData.popularity = teamPublic.popularity;
        }
        else
          this.fm.getTeamPublicAsync(teamId);
        this.fm.FireCustomEvent('serviceteamready', teamId);
      }
    }
    );

    document.addEventListener('teampublicready', e => {
      let teamId = e['detail'];
      let teamData = this.findOrCreateTeam(teamId);
      let teamPublic = this.fm.getTeamPublic(teamId);
      if (teamData && teamPublic) {
        teamData.ability = teamPublic.ability || 1000;
        teamData.popularity = teamPublic.popularity;
      }
    });

    document.addEventListener('teamstatsdataready', e => {
      let teamId = e['detail'];
      let teamData = this.findOrCreateTeam(teamId);
      let teamStats = this.fm.getTeamStats(teamId);
      if (teamData && teamStats) {
        teamData.last_5 = teamStats.last_5;
        teamData.last_15 = teamStats.last_15;
        teamData.last_30 = teamStats.last_30;
        teamData.overall = teamStats.overall;
        //console.log(teamStats);
        this.updateAvg(teamData.last_15);
        this.updateAvg(teamData.last_30);
        this.updateAvg(teamData.overall);
        teamData.yearlyHistory = [];
        for (let i = 2006; i <= new Date().getFullYear(); ++i) {
          if (teamStats[i]) {
            let history = teamStats[i];
            history['year'] = i;
            teamData.yearlyHistory.push(history);
          }
        }
      }
      //console.log(teamData);
      this.fm.FireCustomEvent('serviceteamstatsdataready', teamId);
    });

    document.addEventListener('matchsquadready', e => {
      let detail = e['detail'];
      let squad = this.fm.getMatchSquad(detail.teamId, detail.matchId);
      let team = this.getTeam(detail.teamId);
      if (team) {
        team.matchSquads[detail.matchId] = squad;
        events.publish('servicematchsquadready', detail.teamId, detail.matchId);
        //this.fm.FireCustomEvent('servicematchsquadready', detail);
      }
    });

    document.addEventListener('playerready', e => {
      console.log(this.bRefreshPlayerTeams);
      
      if (this.bRefreshPlayerTeams) {
        let id = e['detail'];
        let player = this.fm.getPlayer(id);
        if (this.getPlayerTeams(id))
          this.playerTeamsMap[id].splice(0);
        else
          this.playerTeamsMap[id] = [];
        for (let tId in player.teams) {
          let team = this.findOrCreateTeamAndPull(tId);
          //console.log(tId);     
          this.playerTeamsMap[id].push(team);
        }
        //console.log(this.playerTeamsMap[id]);
        this.bRefreshPlayerTeams = false;
        this.fm.FireCustomEvent('serviceplayerteamsready', id);
      }
    });

    document.addEventListener('teamsquadsready', e => {
      let teamId = e['detail'];
      let team = this.findOrCreateTeam(teamId);
      team.squads.splice(0);
      let squads = this.fm.getTeamSquads(teamId);
      squads.forEach(squad => {
        team.squads.push(squad);
      })
    });
  }

  updateAvg(obj) {
    //console.log(obj.rate);
    if (obj && obj.GA)
      obj['avgGA'] = obj.total_matches > 0 ? (obj.GA / obj.total_matches).toFixed(2) : 0;
    if (obj && obj.GF)
      obj['avgGF'] = obj.total_matches > 0 ? (obj.GF / obj.total_matches).toFixed(2) : 0;
    if (obj && 'rate' in obj)
      obj['roundedRate'] = Math.round(obj.rate * 100);
    //console.log(obj.roundedRate);
  }

  findOrCreateTeam(id): Team {
    let team;
    if (this.teamDataMap[id])
      team = this.teamDataMap[id];
    else {
      team = new Team();
      this.teamDataMap[id] = team;
    }
    return team;
  }

  findOrCreateTeamAndPull(id): Team {
    let team;
    if (this.teamDataMap[id])
      team = this.teamDataMap[id];
    else {
      team = new Team();
      this.teamDataMap[id] = team;
      this.fm.getTeamAsync(id);
    }
    return team;
  }

  deleteTeamSquad(teamId, squadId) {
    this.fm.deleteTeamSquad(teamId, squadId);
  }

  getTeamAsync(id, pullStats = false, pullSquads = false) {
    //console.log('getTeamAsync', id, pullStats, pullSquads);
    if (this.getTeam(id))
      this.fm.FireCustomEvent('serviceteamready', id);
    else
      this.fm.getTeamAsync(id);

    if (pullStats)
      this.fm.getTeamStatsAsync(id);
    if (pullSquads)
      this.fm.getTeamSquadsAsync(id);
  }

  getTeam(id): Team {
    return this.teamDataMap[id];
  }

  increasePopularity(id) {
    this.fm.increaseTeamPopularity(id);
  }

  createTeam(teamObj, isDefault = false) {
    this.fm.createTeam(teamObj, isDefault);
    this.bRefreshPlayerTeams = true;
  }

  selfTeamId() {
    return this.fm.selfTeamId();
  }

  getAllTeams() {
    let allPublicTeams = this.fm.getAllPublicTeams();
    this.allTeams.splice(0);
    allPublicTeams.forEach(publicTeam => {
      let id = publicTeam.$key;
      let teamNotCached = !this.teamDataMap[id];
      let team = this.findOrCreateTeam(id);
      this.allTeams.push(team);
      if (teamNotCached)
        this.fm.getTeamAsync(id);
    });

    return this.allTeams;
  }

  // getAllTeamsAsync() {
  //   this.fm.getAllPublicTeamsAsync();
  // if (this.getAllTeams()) {
  //   this.fm.FireEvent('allteamsready');
  // }
  // else 
  //   this.fm.getAllPublicTeams();
  // }

  getPlayerTeams(id) {
    return this.playerTeamsMap[id];
  }

  getPlayerTeamsAsync(id) {
    this.bRefreshPlayerTeams = true;
    // if (this.getPlayerTeams(id))
    //   this.fm.FireCustomEvent('serviceplayerteamsready', id);
    // else
    this.fm.getPlayerAsync(id);
  }

  teamEarnPoints(teamId, amount) {
    let team = this.getTeam(teamId);
    let newPoints = team.points ? team.points + amount : amount;
    this.fm.teamEarnPoints(teamId, amount, newPoints);
  }

  isTeamExist(id) {
    return this.teamDataMap[id] && 'id' in this.teamDataMap[id];
  }

  updateTeamName(id: string, name: string) {
    this.fm.updateTeamName(id, name);
  }

  promoteNewCaptain(teamId: string, playerId: string) {
    this.fm.promoteNewCaptain(teamId, playerId);
  }

  saveTeamSquad(teamId, squadObj, squadId = null) {
    if (squadId)
      this.fm.updateTeamSquad(teamId, squadId, squadObj);
    else 
      this.fm.createTeamSquad(teamId, squadObj);
  }

  saveMatchSquad(teamId, matchId, squadObj) {
    this.fm.saveMatchSquad(teamId, matchId, squadObj);
  }

  getMatchSquad(teamId, matchId) {
    console.log('getMatchSquad', teamId, matchId);  
    let team = this.getTeam(teamId);
    if (team)
      return team.matchSquads[matchId];
    return null;
  }

  getMatchSquadAsync(teamId, matchId) {
    if (this.getMatchSquad(teamId, matchId)) {
      this.events.publish('servicematchsquadready', teamId, matchId);
    }
    else {
      this.fm.getMatchSquadAsync(teamId, matchId);
    }
  }

  updateMatchParticipants(teamId, matchId, participants) {
    this.fm.updateMatchParticipants(teamId, matchId, participants);
  }

  joinTeam(teamId, isDefault) {
    this.fm.joinTeam(teamId, isDefault);
  }

  getAfPublicTeamName(teamId: string) {
    return this.fm.getAfTeamPublicName(teamId);
  }

  ratePlayers(teamId, matchId, ratings) {
    this.fm.ratePlayers(teamId, matchId, ratings);
  }

  updateTeamLogo(id, logo) {
    this.fm.updateTeamLogo(id, logo);
  }
}