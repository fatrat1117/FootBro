import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular'

import { CheeringTeamStatsPage } from './cheering-team-stats'

@Component({
  selector: 'page-cheering-team',
  templateUrl: 'cheering-team.html',
})
export class CheeringTeamPage {
  who = "baby";
  colorArray = [-1,-1,-1,-1];


  constructor(private nav: NavController, private modalCtrl: ModalController) {

  }

  highLight(index:number){
    if (index < this.colorArray.length){
     this.colorArray[index] = this.colorArray[index] * -1;
    }
  }

  getColor(index:number){
    if (index < this.colorArray.length){
        if (this.colorArray[index] == 1){
           return "#00ef00";
        }else{
            return "#999";
        }
    }else{
      return "#999";
    }
  }

  unlockBaby() {
    this.modalCtrl.create(CheeringTeamStatsPage).present();
  }

}

