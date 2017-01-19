import {Component,ElementRef} from '@angular/core';
import {NavController} from 'ionic-angular';

import {Localization} from '../../providers/localization';
import {CheeringTeamPage} from '../cheering-team/cheering-team';
import {GameSchedulePage} from "../game-schedule/game-schedule";

declare var jQuery:any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  slides: any[];
  adSlideOptions: any;
  items = ["item1","item2","item3"];

  constructor(public navCtrl: NavController, local: Localization,private elRef: ElementRef) {

    this.slides = [];
    this.loadSlides(local.langCode, 4);

    this.adSlideOptions = {
      autoplay: 3000,
      loop: true
    };
    console.log(local.langCode);


  }

  ionViewDidLoad() :any{
    jQuery(this.elRef.nativeElement).find('.test-button').on('click',function(){
        alert("jQuery works");
    });
  }

  loadSlides(langCode: string, total: number) {
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

  enterCheeringTeam(){
    this.navCtrl.push(CheeringTeamPage);
  }

  enterGameSchedule(){
    this.navCtrl.push(GameSchedulePage);
  }

  selectItems(item:string){
    console.log("Selected Item", item);
  }

}
