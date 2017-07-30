import { Component } from '@angular/core';
import { NavParams, ModalController, ViewController } from 'ionic-angular'

@Component({
  selector: 'page-training',
  templateUrl: 'training.html'
})
export class TrainingPage {
  ik_player;
  videos = [];
  constructor() {
    this.videos = [{
      title: 'abc',
      level: 1,
      description: 'xxxx',
      url: 'https://www.youtube.com/embed/Gym1QEsdHI0?version=3&enablejsapi=1',
      type: 'physical',
      id: 'Gym1QEsdHI0'
    },
    {
      title: 'fdsfds',
      level: 2,
      description: 'xxxx',
      url: 'https://www.youtube.com/embed/Gym1QEsdHI0?enablejsapi=1',
      type: 'technique',
      id: 'Gym1QEsdHI0'
    },
    {
      title: 'gdgfdg',
      level: 3,
      description: 'xxxx',
      url: 'https://www.youtube.com/embed/Gym1QEsdHI0?enablejsapi=1',
      type: 'tactics',
      id: 'Gym1QEsdHI0'
    }];
  }

  //this function is called by the API
  // onYouTubeIframeAPIReady() {
  //   //creates the player object
  //   this.ik_player = new YT.Player('ik_player_iframe');

  //   console.log('Video API is loaded');

  //   //subscribe to events
  //   //this.ik_player.addEventListener("onReady",       "onYouTubePlayerReady");
  //   this.ik_player.addEventListener("onStateChange", e => {console.log('Video state changed');});
  // }

  // function onYouTubePlayerReady() {
  //   console.log('Video is ready to play');
  // }

  // function onYouTubePlayerStateChange(event) {
  //   console.log('Video state changed');
  // }

  onStateChange(event) {
    console.log('player state', event);
  }
}
