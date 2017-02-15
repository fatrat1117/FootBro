import { Injectable } from '@angular/core';
import { FirebaseManager } from '../../providers/firebase-manager';
import { Team } from './team.model';

@Injectable()
export class TeamService {
  teamDataMap = {};
  allTeams = [];

  constructor(private fm: FirebaseManager) {
    document.addEventListener('teamready', e => {
      let teamId = e['detail'];
      let team = this.fm.getTeam(teamId);

      if (team) {
        let teamData = this.findOrCreateTeam(team.$key);
        
        teamData.id = team.$key;
        teamData.logo = team['basic-info'].logo;
        teamData.name = team['basic-info'].name;
        teamData.totalPlayers = team['basic-info'].totalPlayers;
        teamData.players = team.players;

        let teamPublic = this.fm.getTeamPublic(teamId);
        if (teamPublic) {
          teamData.ability = teamPublic.ability;
          teamData.popularity = teamPublic.popularity;
        }
        else
          this.fm.getTeamPublicAsync(teamId);
        this.fm.FireCustomEvent('serviceteamready', teamId);
        //this.fm.getTeamStatsAsync(teamId);
      }
    }
    );

    document.addEventListener('teampublicready', e => {
      let teamId = e['detail'];
      let teamData = this.teamDataMap[teamId];
      let teamPublic = this.fm.getTeamPublic(teamId);
      if (teamData && teamPublic) {
        teamData.ability = teamPublic.ability;
        teamData.popularity = teamPublic.popularity;
      }
    });

    document.addEventListener('teamstatsdataready', e => {
      let teamId = e['detail'];
      let teamData = this.teamDataMap[teamId];
      let teamStats = this.fm.getTeamStats(teamId);
      if (teamData && teamStats) {
        teamData.last_5 = teamStats.last_5;
        teamData.last_15 = teamStats.last_15;
        teamData.last_30 = teamStats.last_30;
        teamData.overall = teamStats.overall;
      }
      this.fm.FireCustomEvent('serviceteamstatsdataready', teamId);
    });

    document.addEventListener('allpublicteamsready', e => {
      let allPublicTeams = this.fm.getAllPublicTeams();
      this.allTeams = [];
      allPublicTeams.forEach(publicTeam => {
        let id = publicTeam.$key;
        let team = this.findOrCreateTeam(id);
        this.allTeams.push(team);
        this.fm.getTeamAsync(id);
      });

      this.fm.FireEvent('serviceallteamsready');
    })
  }

  findOrCreateTeam(id) {
    let team;
    if (this.teamDataMap[id])
      team = this.teamDataMap[id];
    else {
      team = new Team();
      this.teamDataMap[id] = team;
    }
    return team;
  }

  getTeamAsync(id, pullStats = false) {
    if (this.getTeam(id))
      this.fm.FireCustomEvent('serviceteamready', id);
    else
      this.fm.getTeamAsync(id);

    if(pullStats)
      this.fm.getTeamStatsAsync(id);
  }

  getTeam(id): Team {
    return this.teamDataMap[id];
  }

  increasePopularity(id) {
    this.fm.increaseTeamPopularity(id);
  }

  createTeam(teamObj, isDefault = false) {
    this.fm.createTeam(teamObj, isDefault);
  }

  selfTeamId() {
    return this.fm.selfTeamId();
  }

  getAllTeams() {
    return this.allTeams;
  }

  getAllTeamsAsync() {
    this.fm.getAllPublicTeamsAsync();
    // if (this.getAllTeams()) {
    //   this.fm.FireEvent('allteamsready');
    // }
    // else 
    //   this.fm.getAllPublicTeams();
  }

  quiteTeam(id) {
    alert("TODO: quite team");
  }

  setDefaultTeam(id) {
    alert("TODO: change default team");
  }
}