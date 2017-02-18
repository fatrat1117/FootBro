import { Injectable } from '@angular/core';
import { FirebaseManager } from '../../providers/firebase-manager';
import { Player } from './player.model';

@Injectable()
export class PlayerService {
  playersMap = {};

  constructor(private fm: FirebaseManager) {
    document.addEventListener('playerready', e => {
      let id = e['detail'];

      let playerData = this.fm.getPlayer(id);
      let player = new Player();
      player.id = playerData.$key;
      player.points = playerData.points;
      player.name = playerData['basic-info'].displayName || "John Doe";
      player.photo = playerData['basic-info'].photoURL || "assets/img/none.png";
      player.teamId = playerData['basic-info'].teamId;
      if (playerData.photoMedium)
        player.photoMedium = playerData.photoMedium;
      if (playerData.points)
        player.points = playerData.points;

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

      if (playerData.role)
        player.role = playerData.role;
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

    // document.addEventListener('cheerleaderpublicready', e => {
    //   let id = e['detail'];
    //   let cheerleaderPublic = this.fm.getCheerleaderPublic(id);
    //   let player = this.getPlayer(id);
    //   if (player) {
    //     player.popularity = cheerleaderPublic.popularity;
    //   }
    // });
  }

  getPlayerAsync(id) {
    if (this.getPlayer(id)) {
      this.fm.FireCustomEvent('serviceplayerready', id);
    }
    else {
      this.fm.getPlayerAsync(id);
    }
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

  placeOrder(toId: string, amount: number) {
    this.fm.placeOrder(toId, amount);
  }

  unlockCheerleader(playerId: string, newPoints: number, newUnlockPoints: number, selfNewPoints: number) {
    this.fm.unlockCheerleader(playerId, newPoints, newUnlockPoints, selfNewPoints);
  }

  isAdmin() {
    if (this.fm.admins && this.selfId() && true === this.fm.admins[this.selfId()])
      return true;
    return false;
  }

  getSelfPlayer() : Player {
    if (this.selfId())
      return this.playersMap[this.selfId()];
    return null;
  }

  isAuthenticated() {
    return this.fm.auth && this.fm.auth.uid;
  }

  checkLogin() {
    this.fm.checkLogin();
  }
}