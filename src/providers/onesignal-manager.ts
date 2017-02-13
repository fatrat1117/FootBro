import { Injectable } from '@angular/core';
import { OneSignal } from 'ionic-native';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { LoginPage } from '../pages/login/login';
import { NavController, ModalController, Platform } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { Camera } from 'ionic-native';
import * as firebase from 'firebase';

@Injectable()
export class OneSignalManager {
  constructor() {

  }

  initialize() {
  }

  sendNotification(playerId: string, title, message: string) {

  }





  /****************************** Cheerleaders ******************************/
  cheerleaderApproved(id: string) {
    alert(`${id} is verified.`);
  }

}