import {Component} from '@angular/core';
import {NavController} from 'ionic-angular'

@Component({
  selector: 'page-cheering-team',
  templateUrl: 'cheering-team.html',
})
export class CheeringTeamPage {
  who = "baby";


  constructor(private nav: NavController) {

  }

}

