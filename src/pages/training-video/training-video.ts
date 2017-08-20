import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular'

@Component({
  selector: 'page-training-video',
  templateUrl: 'training-video.html'
})
export class TrainingVideoPage {
  videoId = '';
  constructor(param: NavParams) {
    this.videoId = param.get('videoId');
  }

  onStateChange(event) {
    console.log('player state', event);
    if (0 == event.data) {
    }
  }
}
