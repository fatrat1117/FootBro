import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular'
import { PlayerService } from '../../app/players/player.service'

@Component({
  selector: 'page-training-video',
  templateUrl: 'training-video.html'
})
export class TrainingVideoPage {
  video;
  constructor(param: NavParams,
  private player: PlayerService) {
    this.video = param.get('video');
    //console.log(this.video);
  }

  onStateChange(event) {
    console.log('player state', event);
    if (0 == event.data) {
      this.player.finishTraining(this.video.type);
    }
  }
}
