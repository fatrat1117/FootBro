import { Injectable } from '@angular/core';
import { FirebaseManager } from '../../providers/firebase-manager';
import { Cheerleader } from './cheerleader.model';
import { PlayerService } from '../players/player.service'
import { UIHelper } from '../../providers/uihelper'

@Injectable()
export class CheerleaderService {
  constructor(private fm: FirebaseManager,
    private playerService: PlayerService,
    private uiHelper : UIHelper) {
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
}