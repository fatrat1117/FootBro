import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, OneSignal } from 'ionic-native';
import { ModalController } from 'ionic-angular';
import { Localization } from '../providers/localization';
import * as localforage from "localforage";
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';


import { FirebaseManager } from '../providers/firebase-manager';
import { OneSignalManager } from '../providers/onesignal-manager';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;

  constructor(private platform: Platform,
    modalCtrl: ModalController,
    loc: Localization,
    fm: FirebaseManager,
    osm: OneSignalManager) {
    loc.setLang(navigator.language);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      //this.registerForPushNotifications();
      fm.initialize();
      osm.initialize();
      // tutorial
      localforage.getItem('notFirstTime').then(val => {
        if (!val) {
          modalCtrl.create(TutorialPage).present();
        }
      });
    });
  }

/*
  registerForPushNotifications() {
    if (this.platform.is('mobileweb') ||
      this.platform.is('core'))
      return;

    OneSignal.startInit('f6268d9c-3503-4696-8e4e-a6cf2c028fc6', '63493717987');

    OneSignal.inFocusDisplaying(OneSignal.OSInFocusDisplayOption.InAppAlert);
    OneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
    });

    OneSignal.handleNotificationOpened().subscribe(() => {
      // do something when a notification is opened
    });

    OneSignal.endInit();
    OneSignal.getIds().then(data => {
      console.log("data ", data);

      // this gives you back the new userId and pushToken associated with the device. Helpful.
    });
  }
  */
  /*
  // Enable to debug issues.
  window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
  let notificationOpenedCallback = function (jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };

  window["plugins"].OneSignal
    .startInit("f6268d9c-3503-4696-8e4e-a6cf2c028fc6", "63493717987")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();
  // window["plugins"].OneSignal.init("f6268d9c-3503-4696-8e4e-a6cf2c028fc6",
  //   { googleProjectNumber: "63493717987" },
  //   notificationOpenedCallback);
   window["plugins"].OneSignal.enableInAppAlertNotification(false);
   window["plugins"].OneSignal.enableNotificationsWhenActive(true);
  */
}
