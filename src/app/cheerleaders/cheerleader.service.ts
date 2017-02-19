import { Injectable } from '@angular/core';
import { FirebaseManager } from '../../providers/firebase-manager';
import { OneSignalManager } from '../../providers/onesignal-manager';
import { Cheerleader } from './cheerleader.model';
import { PlayerService } from '../players/player.service'
import { UIHelper } from '../../providers/uihelper'

@Injectable()
export class CheerleaderService {
  cheerleadersMap = {};
  pendingCheerleaders;
  approvedCheerleaders;

  constructor(private fm: FirebaseManager, private osm: OneSignalManager,
    private playerService: PlayerService, private uiHelper: UIHelper) {
    document.addEventListener('pendingcheerleadersready', e => {
      this.pendingCheerleaders = [];
      this.fm.cachedPendingCheerleaders.forEach(fmCheerleader => {
        let cheerleader = this.findOrCreateCheerleader(fmCheerleader.$key);
        cheerleader.photoMedium = fmCheerleader.photo;
        this.pendingCheerleaders.push(cheerleader);
        this.playerService.getPlayerAsync(fmCheerleader.$key);
      });

      this.fm.FireEvent('servicependingcheerleadersready');
    });

    document.addEventListener('approvedcheerleadersready', e => {
      this.approvedCheerleaders = [];
      this.fm.cachedApprovedCheerleaders.forEach(fmCheerleader => {
        let cheerleader = this.findOrCreateCheerleader(fmCheerleader.$key);
        cheerleader.photoMedium = fmCheerleader.photo;
        this.approvedCheerleaders.push(cheerleader);
        this.playerService.getPlayerAsync(fmCheerleader.$key);
        this.fm.getCheerleaderPublicAsync(fmCheerleader.$key);
      });

      this.fm.FireEvent('serviceapprovedcheerleadersready');
    });

    document.addEventListener('serviceplayerready', e => {
      let id = e['detail'];
      let cheerleader = this.findOrCreateCheerleader(id);
      let p = this.playerService.getPlayer(id);
      cheerleader.name = p.name;
      if (p.photoMedium)
        cheerleader.photoMedium = p.photoMedium;
      if (p.pushId)
        cheerleader.pushId = p.pushId;

      if ('points' in p)
        cheerleader.points = p.points;
      else
        cheerleader.points = 0;
    });

    document.addEventListener('cheerleaderpublicready', e => {
      let id = e['detail'];
      let cheerleaderPublic = this.fm.getCheerleaderPublic(id);
      
      let cheerleader = this.findOrCreateCheerleader(id);
      if (cheerleader) {
        cheerleader.popularity = cheerleaderPublic.popularity;
        cheerleader.unlockPoints = cheerleaderPublic.unlockPoints;
        cheerleader.received = cheerleaderPublic.received;
        cheerleader.responsed = cheerleaderPublic.responsed;
        cheerleader.responseRate = cheerleaderPublic.responseRate;
      }
    });
  }

  submitInfo() {
    let width = 512;
    let height = 512;

    this.fm.selectImgGetData(width, height, imgData => {
      this.fm.updateImgGetUrl(imgData, this.playerService.selfId() + 'medium', width, height,
        url => {
          this.fm.submitCheerleaderInfo(url);
          this.uiHelper.presentToast('ApplicationSubmited');
        }, e => {
          alert(e);
        })
    }, err => {
      alert(err);
    });
  }

  findOrCreateCheerleader(id): Cheerleader {
    let cheerleader;
    if (!this.cheerleadersMap[id]) {
      cheerleader = new Cheerleader();
      cheerleader.id = id;
      this.cheerleadersMap[id] = cheerleader;
    } else {
      cheerleader = this.cheerleadersMap[id];
    }
    return cheerleader;
  }

  getPendingCheerleaders() {
    return this.pendingCheerleaders;
  }

  getPendingCheerleadersAsync() {
    if (this.getPendingCheerleaders())
      this.fm.FireEvent('pendingcheerleadersready');
    else
      this.fm.getPendingCheerleadersAsync();
  }

  getApprovedCheerleaders() {
    return this.approvedCheerleaders;
  }

  getApprovedCheerleadersAsync() {
    if (this.getApprovedCheerleaders())
      this.fm.FireEvent('approvedcheerleadersready');
    else
      this.fm.getApprovedCheerleadersAsync();
  }

  afPendingCheerleaderSelf() {
    return this.fm.afPendingCheerleaderSelf();
  }

  approve(id) {
    this.fm.approveCheerleader(this.cheerleadersMap[id]);
    this.osm.cheerleaderApproved(id, this.cheerleadersMap[id].pushId);
  }

  isCheerleader(id) {
    return this.cheerleadersMap[id] && this.cheerleadersMap[id].photoMedium;
  }
}