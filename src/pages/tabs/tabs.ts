import { Component, ViewChild} from '@angular/core';
import { OneSignal } from 'ionic-native';
import {Tabs} from 'ionic-angular';
import { HomePage } from '../home/home';
import { RankPage } from '../rank/rank';
import { MatchesPage } from '../matches/matches';
import { MessagesPage } from '../messages/messages';
import { MePage } from '../me/me';
import { FirebaseManager } from '../../providers/firebase-manager';
import { OneSignalManager } from '../../providers/onesignal-manager';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  @ViewChild('mainTabs') tabRef: Tabs;

  tab0Root: any = HomePage;
  tab1Root: any = MatchesPage;
  //tab1Root: any = RankPage;
  tab2Root: any = null;
  tab3Root: any = null;

  constructor(private fm: FirebaseManager, private osm: OneSignalManager) {
    
  }

  ionViewDidLoad() {
    document.addEventListener('userlogin', e => {
      this.tab2Root = MessagesPage;
      this.tab3Root = MePage;
    });

    document.addEventListener('userlogout', e => {
      this.tabRef.select(0);
      this.tab2Root = null;
      this.tab3Root = null;
    });

    //this.fm.initialize();
    //this.osm.initialize(this.tabRef);
  }

  checkLogin() {
    this.fm.checkLogin();
  }
}
