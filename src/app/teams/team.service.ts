import { Injectable } from '@angular/core';
import { FirebaseManager } from '../../providers/firebase-manager';
import { Team } from './team.model';

@Injectable()
export class TeamService {
  teamDataMap = {};
  allTeams = [];
  playerTeamsMap = {};
  bRefreshPlayerTeams = false;

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
      }
    }
    );

    document.addEventListener('teampublicready', e => {
      let teamId = e['detail'];
      let teamData = this.findOrCreateTeam(teamId);
      let teamPublic = this.fm.getTeamPublic(teamId);
      if (teamData && teamPublic) {
        teamData.ability = teamPublic.ability;
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

    // document.addEventListener('allpublicteamsready', e => {
    //   let allPublicTeams = this.fm.getAllPublicTeams();
    //   this.allTeams = [];
    //   allPublicTeams.forEach(publicTeam => {
    //     let id = publicTeam.$key;
    //     let team = this.findOrCreateTeam(id);
    //     this.allTeams.push(team);
    //     this.fm.getTeamAsync(id);
    //   });

    //   this.fm.FireEvent('serviceallteamsready');
    // });

    document.addEventListener('playerready', e => {
      if (this.bRefreshPlayerTeams) {
        let id = e['detail'];
        let player = this.fm.getPlayer(id);
        // console.log(player);
        // let teams;
        // if (this.playerTeamsMap[id]) {
        //   teams = this.playerTeamsMap[id];
        //   teams = [];
        // }
        // else {
        //   teams = [];
        this.playerTeamsMap[id] = [];
        //}
        for (let tId in player.teams) {
          let team = this.findOrCreateTeam(tId);
          //console.log(tId);     
          this.playerTeamsMap[id].push(team);
          this.fm.getTeamAsync(tId);
        }
        //console.log(this.playerTeamsMap[id]);
        this.bRefreshPlayerTeams = false;
        this.fm.FireCustomEvent('serviceplayerteamsready', id);
      }
    });
  }

  updateAvg(obj) {
    if (obj && obj.GA)
      obj['avgGA'] = obj.total_matches > 0 ? (obj.GA / obj.total_matches).toFixed(2) : 0;
    if (obj && obj.GF)
      obj['avgGF'] = obj.total_matches > 0 ? (obj.GF / obj.total_matches).toFixed(2) : 0;
    if (obj && obj.rate)
      obj.rate = Math.round(obj.rate * 100);
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

  getTeamAsync(id, pullStats = false) {
    if (this.getTeam(id))
      this.fm.FireCustomEvent('serviceteamready', id);
    else
      this.fm.getTeamAsync(id);

    if (pullStats)
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
    let allPublicTeams = this.fm.getAllPublicTeams();
      this.allTeams = [];
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

    if (this.getPlayerTeams(id))
      this.fm.FireCustomEvent('serviceplayerteamsready', id);
    else
      this.fm.getPlayerAsync(id);
  }
}