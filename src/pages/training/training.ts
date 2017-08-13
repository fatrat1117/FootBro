import { Component } from '@angular/core';
import { NavParams, ModalController, ViewController } from 'ionic-angular'

@Component({
  selector: 'page-training',
  templateUrl: 'training.html'
})
export class TrainingPage {
  ik_player;
  videos = [];
  videoId = 'Gym1QEsdHI0';
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
      id: 'tnLlNzB9OdA'
    },
    {
      title: 'gdgfdg',
      level: 3,
      description: 'xxxx',
      url: 'https://www.youtube.com/embed/Gym1QEsdHI0?enablejsapi=1',
      type: 'tactics',
      id: 'NxV_02Uk1_E'
    }];
    // let index = this.getRandomInt(0, 2);
    // console.log(this.videos, index);
    // this.videoId = this.videos[index].id;
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
 getThumbnailUrl(id) {
   return 'https://i1.ytimg.com/vi/' + id + '/2.jpg';
 }

  onStateChange(event) {
    console.log('player state', event);
  }

  playVideo(id) {
    this.videoId = id;
    console.log(this.videoId);
  }
}
