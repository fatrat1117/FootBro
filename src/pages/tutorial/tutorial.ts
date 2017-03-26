import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Localization } from '../../providers/localization';

import * as localforage from "localforage";


@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {
  /*
  slides = [
    {
      title: "{{ 'Team' | trans }}",
      description: "All infomation of your team could be found here.",
      image: "assets/img/tutorial/ica-slidebox-img-1.png",
    },
    {
      title: "What is Ionic?",
      description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
      image: "assets/img/tutorial/ica-slidebox-img-2.png",
    },
    {
      title: "What is Ionic Cloud?",
      description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
      image: "assets/img/tutorial/ica-slidebox-img-3.png",
    }
  ];
  */
  slides: any[];
  titles = ['Team'];
  descriptions = ['teamDesc'];

  constructor(private viewCtrl: ViewController, private local: Localization) {
    this.loadSlides(local.langCode, 1);
  }

  loadSlides(langCode: string, total: number) {
    this.slides = [];
    for (let i = 0; i < total; ++i) {
      this.slides.push({
        title: this.local.getString(this.titles[i]),
        description: this.local.getString(this.descriptions[i]),
        image: `assets/img/tutorial/${langCode}/${i}.jpg`
      });
    }
  }

  finishTutorial() {
    this.viewCtrl.dismiss();
    localforage.setItem('notFirstTime', 'true');
  }
}
