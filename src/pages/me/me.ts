import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {MyPlayerPage} from "../my-player/my-player";

@Component({
  selector: 'page-me',
  templateUrl: 'me.html',
})
export class MePage {

  constructor(private navCtrl: NavController) {

  }

  goPlayerPage(){
    this.navCtrl.push(MyPlayerPage);
  }
}
