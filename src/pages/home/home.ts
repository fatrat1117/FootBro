import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {TransPipe} from '../../providers/localization'
import {Localization} from '../../providers/localization';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  slides: any[];
  adSlideOptions: any;

  constructor(public navCtrl: NavController, local: Localization) {

    this.slides = [];
    this.loadSlides(local.langCode, 4);

    this.adSlideOptions = {
      autoplay: 3000,
      loop: true
    };
    console.log(local.langCode);


  }

  loadSlides(langCode: string, total: number) {
    let path = `assets/img/banners/${langCode}/`
    for (let i = 0; i < total; ++i) {
      this.slides.push({
        image: `assets/img/banners/${langCode}/${i}.jpg`
      });
    }
  }

  goLeaguePage() {
    return;
  }

  enterStandings() {
    return;
  }

}
