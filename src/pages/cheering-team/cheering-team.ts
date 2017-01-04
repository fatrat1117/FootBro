import {Component} from '@angular/core';
import {NavController} from 'ionic-angular'

@Component({
  selector: 'page-cheering-team',
  templateUrl: 'cheering-team.html',
})
export class CheeringTeamPage {
  who = "baby";
  colorArray = [-1,-1,-1,-1];


  constructor(private nav: NavController) {

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

}

