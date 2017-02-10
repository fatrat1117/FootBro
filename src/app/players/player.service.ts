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
      player.name = playerData['basic-info'].displayName || "John Doe" ;
      player.photo = playerData['basic-info'].photoURL || "assets/img/none.png";
      player.teamId = playerData['basic-info'].teamId;
      
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
        
      this.playersMap[id] = player;
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
      
    }
    );
  }

  getPlayerAsync(id) {
    if (this.getPlayer(id)) {
      this.fm.FireCustomEvent('serviceplayerready', id);
    }
    else 
    {
      this.fm.getPlayerAsync(id);
    }
  }

  getPlayer(id) : Player {
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
}