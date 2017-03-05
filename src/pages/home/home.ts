import {Component,ElementRef} from '@angular/core';
import {NavController, ModalController, NavParams, ViewController, Platform} from 'ionic-angular';
import {Localization} from '../../providers/localization';
import {CheeringTeamPage} from '../cheering-team/cheering-team';
import {RankPage} from '../rank/rank';
import {GameSchedulePage} from "../game-schedule/game-schedule";
import {ModalContentPage} from "../home/place-selection";
import {GameRatingPage} from "../game-rating/game-rating";
import {SquadPage} from "../squad/squad"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  slides: any[];
  items = ["item1","item2","item3"];

  constructor(public navCtrl: NavController, local: Localization,private elRef: ElementRef,public modalCtrl: ModalController  ) {
    this.slides = [];
    this.loadSlides(local.langCode, 4);
  }

  ionViewDidLoad() :any{
  }

  loadSlides(langCode: string, total: number) {
    for (let i = 0; i < total; ++i) {
      this.slides.push({
        image: `assets/img/banners/${langCode}/${i}.jpg`
      });
    }
  }

  goLeaguePage() {
    this.modalCtrl.create(GameRatingPage).present();
   // this.navCtrl.push(GameRatingPage);
  }

  enterStandings() {
    return;
  }

  enterCheeringTeam(){
    this.navCtrl.push(CheeringTeamPage);
  }

  enterRankPage(){
    this.navCtrl.push(RankPage);
  }

  enterGameSchedule(){
    this.navCtrl.push(GameSchedulePage);
  }

  selectItems(item:string){
    console.log("Selected Item", item);
  }

  openModal(characterNum:number) {

    let modal = this.modalCtrl.create(ModalContentPage, characterNum);
    modal.present();
    // alert("123");
  }

  testSquad() {
    this.navCtrl.push(SquadPage);
  }
}

