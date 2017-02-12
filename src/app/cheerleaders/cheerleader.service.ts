import { Injectable } from '@angular/core';
import { FirebaseManager } from '../../providers/firebase-manager';
import { Cheerleader } from './cheerleader.model';
import { PlayerService } from '../players/player.service'

@Injectable()
export class CheerleaderService {
  constructor(private fm: FirebaseManager,
    private playerService: PlayerService) {
  }

  submitInfo() {
    let width = 1024;
    let height = 1024;

    this.fm.selectImgGetData(width, height, imgData => {
      this.fm.updateImgGetUrl(imgData, this.playerService.selfId() + 'medium', width, height,
        url => {
          this.fm.submitCheerleaderInfo(url);
        }, e => {
          alert(e);
        })
    }, err => {
      alert(err);
    });
  }
}