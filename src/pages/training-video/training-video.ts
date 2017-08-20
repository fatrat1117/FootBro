import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular'
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'page-training-video',
  templateUrl: 'training-video.html'
})
export class TrainingVideoPage {
  videoId = '';
  videoUrl;
  constructor(param: NavParams,
  domSanitizer: DomSanitizer) {
    this.videoId = param.get('videoId');
    this.videoUrl = domSanitizer.bypassSecurityTrustResourceUrl("http://www.youtube.com/embed/" + this.videoId + "?enablejsapi=1&origin=https://soccerbrostudio.com");
  }

  onStateChange(event) {
    console.log('player state', event);
    if (0 == event.data) {
    }
  }
}
