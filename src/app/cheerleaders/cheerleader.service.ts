import { Injectable } from '@angular/core';
import { FirebaseManager } from '../../providers/firebase-manager';
import { Cheerleader } from './cheerleader.model';
import { PlayerService } from '../players/player.service'
import { UIHelper } from '../../providers/uihelper'

@Injectable()
export class CheerleaderService {
  cheerleadersMap = {};
  pendingCheerleaders;
  approvedCheerleaders;

  constructor(private fm: FirebaseManager,
    private playerService: PlayerService,
    private uiHelper : UIHelper) {
      document.addEventListener('pendingcheerleadersready', e=> {
        this.pendingCheerleaders = [];
        this.fm.cachedPendingCheerleaders.forEach(fmCheerleader => {
          let cheerleader = this.findOrCreateCheerleader(fmCheerleader.$key);
          cheerleader.photoMedium = fmCheerleader.photo;
          this.pendingCheerleaders.push(cheerleader);
          this.playerService.getPlayerAsync(fmCheerleader.$key);
        });

        this.fm.FireEvent('servicependingcheerleadersready');
      });

      document.addEventListener('serviceplayerready', e=> {
        let id = e['detail'];
        let cheerleader = this.findOrCreateCheerleader(id);
        let p = this.playerService.getPlayer(id);
        cheerleader.name = p.name;
        if (p.photoMedium)
          cheerleader.photoMedium = p.photoMedium;
      })
  }

  submitInfo() {
    let width = 1024;
    let height = 1024;

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

  findOrCreateCheerleader(id) : Cheerleader {
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
}