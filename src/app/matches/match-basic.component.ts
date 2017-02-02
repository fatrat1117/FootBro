import { Component, Input } from '@angular/core';

import {MatchBasic} from './match.model'

import{MatchDetailPage} from '../../pages/match-detail/match-detail'
import {NavController} from "ionic-angular";

@Component({
  selector: 'sb-match-basic',
  templateUrl: 'match-basic.component.html',
  styleUrls: ['/app/matches/match-basic.component.scss']
})

export class SbMatchBasicComponent {
  @Input()
  matchBasic: MatchBasic;

  constructor(private navCtrl: NavController){

  }

  goMatchDetailPage() {
    this.navCtrl.push(MatchDetailPage);
  }

}
