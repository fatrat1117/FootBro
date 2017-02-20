import { Component, ViewChild} from '@angular/core';
import {Tabs} from 'ionic-angular';
import { HomePage } from '../home/home';
import { RankPage } from '../rank/rank';
import { MatchesPage } from '../matches/matches';
import { MePage } from '../me/me';
import {FirebaseManager} from '../../providers/firebase-manager';
import { OneSignalManager } from '../../providers/onesignal-manager';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  @ViewChild('mainTabs') tabRef: Tabs;

  tab1Root: any = HomePage;
  tab2Root: any = RankPage;
  tab3Root: any = MatchesPage;
  tab4Root: any = null;

  constructor(private fm: FirebaseManager, private osm: OneSignalManager) {
    
  }

  ionViewDidLoad() {
    document.addEventListener('userlogin', e => {
      this.tab4Root = MePage;
    });

    document.addEventListener('userlogout', e => {
      this.tabRef.select(0);
      this.tab4Root = null;
    });

    //this.fm.initialize();
    //this.osm.initialize();
  }

  checkLogin() {
    this.fm.checkLogin();
  }
}
