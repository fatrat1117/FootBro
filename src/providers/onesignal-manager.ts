import { Injectable } from '@angular/core';
import { OneSignal } from 'ionic-native';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Platform, ModalController } from 'ionic-angular';
import { MessagesPage } from "../pages/messages/messages";

import * as firebase from 'firebase';

import { FirebaseManager } from './firebase-manager';

@Injectable()
export class OneSignalManager {
  constructor(private platform: Platform, private modalCtrl: ModalController, private fm: FirebaseManager) {

  }

  initialize() {
    if (this.platform.is('mobileweb') ||
      this.platform.is('core'))
      return;

    

    /*
    window["plugins"].OneSignal.startInit("f6268d9c-3503-4696-8e4e-a6cf2c028fc6",
      { googleProjectNumber: "63493717987" },
      notificationOpenedCallback).inFocusDisplaying(window["plugins"].OneSignal.OSInFocusDisplayOption.None)
      .endInit();
    
    window["plugins"].OneSignal
      .startInit('f6268d9c-3503-4696-8e4e-a6cf2c028fc6', { googleProjectNumber: "63493717987" })
      .handleNotificationOpened(notificationOpenedCallback)
      .endInit();
      */

    OneSignal.startInit('f6268d9c-3503-4696-8e4e-a6cf2c028fc6', '63493717987');

    OneSignal.inFocusDisplaying(OneSignal.OSInFocusDisplayOption.None);

    /*
    OneSignal.handleNotificationReceived().subscribe(() => {
      console.log("received");
    });

    OneSignal.handleNotificationOpened().subscribe(() => {
      //this.navCtrl.push(MessagesPage);
      //console.log("opened");
      //this.modalCtrl.create(MessagesPage).present();
    });
    */

    OneSignal.endInit();
  }

  postNotification(messageObj, pushIds, success) {
    let notificationObj = {
      heading: {"en": "SoccerBro", "zh-Hans": "足球兄弟"},
      contents: messageObj,
      include_player_ids: pushIds
    };

    window["plugins"].OneSignal.postNotification(notificationObj,
      function(successResponse) {
        console.log("Notification Post Success:", successResponse);
        success();
      },
      function (failedResponse) {
        console.log("Notification Post Failed: ", failedResponse);
        alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
      }
    );

  }





  /****************************** Cheerleaders ******************************/
  sendNewChat(id: string, pushId: string, name: string, content: string) {
    let message = {
      'en': `${name} sent you a new message.`,
      'zh-Hans': `${name} 向你发送了一条新信息.`
    };

    let self = this;
    let success = function (fm: FirebaseManager) {
      self.fm.addChatToUser(id, content);
    }

    this.postNotification(message, [pushId], success)
  }





  /****************************** Cheerleaders ******************************/
  cheerleaderApproved(id: string, pushId: string) {
    let message = {
        'en': "Welcome to join SoccerBro Cheerleaders!",
        'zh-Hans': "欢迎加入拉拉队！" 
    };

    let self = this;
    let success = function (fm: FirebaseManager) {
      self.fm.addChatToUser(id, "Welcome to join SoccerBro Cheerleaders!", true);
    }

    this.postNotification(message, [pushId], success);
  }
}