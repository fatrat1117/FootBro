import { Component } from '@angular/core';
import { NavParams, ModalController, ViewController} from 'ionic-angular'

@Component({
  selector: 'page-training',
  templateUrl: 'training.html'
})
export class TrainingPage {
  videos = [];
  constructor() {
    this.videos = [{
      title: 'abc',
      level: 1,
      description: 'xxxx',
      url: 'https://www.youtube.com/embed/Gym1QEsdHI0?autoplay=1',
      type: 'physical'
    },
    {
      title: 'fdsfds',
      level: 2,
      description: 'xxxx',
      url: 'https://www.youtube.com/embed/Gym1QEsdHI0',
      type: 'technique'
    },
    {
      title: 'gdgfdg',
      level: 3,
      description: 'xxxx',
      url: 'https://www.youtube.com/embed/Gym1QEsdHI0',
      type: 'tactics'
    }];
  }
}
