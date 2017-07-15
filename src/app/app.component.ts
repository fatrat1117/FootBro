import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { StatusBar } from '@ionic-native/status-bar';
import { ModalController, App } from 'ionic-angular';
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
    osm: OneSignalManager,
    app: App,
    splashScreen : SplashScreen,
    keyboard: Keyboard,
    statusBar: StatusBar,
    private cb: Clipboard) {
    loc.setLang(navigator.language);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      // Added by Tianyi that verifies
      // window.FirebasePlugin.onTokenRefresh(function (token) {
      //   // save this server-side and use it to push notifications to this device
      //   console.log(token);
      // }, function (error) {
      //   console.error(error);
      // });

      splashScreen.hide();
      statusBar.styleBlackOpaque();
      keyboard.disableScroll(true);
      //this.registerForPushNotifications();
      fm.initialize();
      osm.initialize(app.getRootNav().getActiveChildNav());
      // tutorial
      //modalCtrl.create(TutorialPage).present();
      localforage.getItem('notFirstTime').then(val => {
        if (!val) {
          this.cb.copy("");
          modalCtrl.create(TutorialPage).present();
        }
      });
    });
  }
}
