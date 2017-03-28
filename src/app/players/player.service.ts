import { Injectable } from '@angular/core';
import { FirebaseManager } from '../../providers/firebase-manager';
import { Player } from './player.model';

@Injectable()
export class PlayerService {
  playersMap = {};
  teamPlayersMap = {};
  bRefreshTeamPlayers = false;

  constructor(private fm: FirebaseManager) {
    document.addEventListener('playerready', e => {
      let id = e['detail'];

      let playerData = this.fm.getPlayer(id);
      let player = this.findOrCreatePlayer(id);
      player.id = playerData.$key;
      //player.points = playerData.points;
      player.name = playerData['basic-info'].displayName || "John Doe";
      player.photo = playerData['basic-info'].photoURL || "assets/img/none.png";
      player.teamId = playerData['basic-info'].teamId;
      player.points = playerData.points;
      if (playerData.photoMedium)
        player.photoMedium = playerData.photoMedium;
      if ('points' in playerData)
        player.points = playerData.points;
      else
        player.points = 0;

      if (playerData['detail-info'] && 'position' in playerData['detail-info'])
        player.position = playerData['detail-info'].position;
      if (playerData['detail-info'] && 'pushId' in playerData['detail-info'])
        player.pushId = playerData['detail-info'].pushId;
      if (playerData['detail-info'] && 'height' in playerData['detail-info'])
        player.height = playerData['detail-info'].height;
      if (playerData['detail-info'] && 'weight' in playerData['detail-info'])
        player.weight = playerData['detail-info'].weight;
      if (playerData['detail-info'] && 'foot' in playerData['detail-info'])
        player.foot = playerData['detail-info'].foot;
      if (playerData['detail-info'] && 'description' in playerData['detail-info'])
        player.description = playerData['detail-info'].description;

      if (playerData.teams) {
        player.teams = [];
        for (let tId in playerData.teams)
          player.teams.push(tId);
      }

      if (playerData.cheerleaders) {
        player.cheerleaders = [];
        for (let id in playerData.cheerleaders)
          player.cheerleaders.push(id);
      }

      player.role = "player";
      if (playerData.role)
        player.role = playerData.role;
      
      if (playerData.joinTime)
        player.joinTime = playerData.joinTime;

      this.playersMap[id] = player;
      if (player.role && player.role === 'cheerleader') {
        //this.fm. getCheerleaderPublicAsync(id);
      }
      else
        this.fm.getPlayerPublicAsync(id);

      this.fm.FireCustomEvent('serviceplayerready', id);
    });

    document.addEventListener('playerpublicready', e => {
      let id = e['detail'];
      let playerPublicData = this.fm.getPlayerPublic(id);
      let player = this.getPlayer(id);
      if (player) {
        player.popularity = playerPublicData.popularity;
      }
    });

    document.addEventListener('teamready', e => {
      if (this.bRefreshTeamPlayers) {
        let id = e['detail'];
        let team = this.fm.getTeam(id);
        //console.log(team);
        
        let players;
        if (this.teamPlayersMap[id]) {
          players = this.teamPlayersMap[id];
          players = [];
        }
        else {
          players = [];
          this.teamPlayersMap[id] = players;
        }

        for (let pId in team.players) {
          let player = this.findOrCreatePlayerAndPull(pId);
          players.push(player);
        }
        this.bRefreshTeamPlayers = false;
        this.fm.FireCustomEvent('serviceteamplayersready', id);
      }
    });

    document.addEventListener('playersocialready', e => {
      let playerId = e['detail'];
      let player = this.findOrCreatePlayer(playerId);
      player.social = this.fm.getPlayerSocial(playerId);
    })
  }

  findOrCreatePlayer(id) : Player{
    let player;
    if (this.playersMap[id])
      player = this.playersMap[id];
    else {
      player = new Player();
      this.playersMap[id] = player;
    }
    return player;
  }

  findOrCreatePlayerAndPull(id) : Player{
    let player;
    if (this.playersMap[id])
      player = this.playersMap[id];
    else {
      player = new Player();
      this.playersMap[id] = player;
      this.fm.getPlayerAsync(id);
    }
    return player;
  }

  getPlayerAsync(id, pullSocial = false) {
    if (this.getPlayer(id)) {
      this.fm.FireCustomEvent('serviceplayerready', id);
    }
    else {
      this.fm.getPlayerAsync(id);
    }

    if (pullSocial)
      this.getPlayerSocialAsync(id);
  }

  getPlayer(id): Player {
    return this.playersMap[id];
  }

  updatePlayerBasic(property: string, value) {
    this.fm.updatePlayerBasic(property, value);
  }

  updatePlayerDetail(property: string, value) {
    this.fm.updatePlayerDetail(property, value);
  }

  increasePopularity(id) {
    this.fm.increasePlayerPopularity(id);
  }

  selfId() {
    return this.fm.selfId();
  }

/*
  placeOrder(toId: string, amount: number) {
    this.fm.placeOrder(this.selfId(), toId, amount);
  }
*/

  unlockCheerleader(cheerleaderId: string, newPoints: number, newUnlockPoints: number, selfNewPoints: number) {
    this.fm.unlockCheerleader(cheerleaderId, newPoints, newUnlockPoints, selfNewPoints);
  }

  isAdmin() {
    if (this.fm.admins && this.selfId() && this.fm.admins[this.selfId()])
      return true;
    return false;
  }

  isAuthenticated() {
    return this.fm.auth && this.fm.auth.uid;
  }

  checkLogin() {
    this.fm.checkLogin();
  }

  setDefaultTeam(id: string) {
    this.fm.setDefaultTeam(id);
  }

  quitTeam(id: string) {
    this.fm.quitTeam(id);
  }

  getTeamPlayers(id) {
    return this.teamPlayersMap[id];
  }

  getTeamPlayersAsync(id) {
    this.bRefreshTeamPlayers = true;

    if (this.getTeamPlayers(id))
      this.fm.FireCustomEvent('serviceteamplayersready', id);
    else
      this.fm.getTeamAsync(id);
  }

  isCaptain(pId, tId) {
    //console.log('isCaptain', pId, tId);
    if (!pId || !tId)
      return false;

    let fmTeam = this.fm.getTeam(tId);
    //console.log(fmTeam);
    if (fmTeam && 'basic-info' in fmTeam)
      return pId === fmTeam['basic-info'].captain;

    return false;
  }

  like(playerId, val, tag) {
    this.fm.likePlayer(playerId, val, tag);
  }

  getPlayerSocial(playerId) {
    let player = this.getPlayer(playerId);
    if (player)
      return player.social;
    return null;
  }

  getPlayerSocialAsync(playerId) {
    if (this.getPlayerSocial(playerId)){
    } else {
      this.fm.getPlayerSocialAsync(playerId);
    }
  }

  updatePlayerPhoto(playerId, photoUrl) {
    this.fm.updatePlayerPhoto(playerId, photoUrl);
  }
}