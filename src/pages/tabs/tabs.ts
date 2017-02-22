import { Component, ViewChild} from '@angular/core';
import { OneSignal } from 'ionic-native';
import { Tabs } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RankPage } from '../rank/rank';
import { MatchesPage } from '../matches/matches';
import { MessagesPage } from '../messages/messages';
import { MePage } from '../me/me';
import { FirebaseManager } from '../../providers/firebase-manager';
import { OneSignalManager } from '../../providers/onesignal-manager';

import { MessageService } from '../../app/messages/message.service'

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
  providers: [MessageService]
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

  unreadCount: number;

  constructor(private fm: FirebaseManager, private osm: OneSignalManager, private messageService: MessageService) {
    
  }

  ionViewDidLoad() {
    document.addEventListener('userlogin', e => {
      this.tab2Root = MessagesPage;
      this.tab3Root = MePage;
      this.messageService.prepareAllMessages();
    });

    document.addEventListener('userlogout', e => {
      this.tabRef.select(0);
      this.tab2Root = null;
      this.tab3Root = null;
    });

    document.addEventListener('servicemessageready', e => {
      this.unreadCount = e['detail'];
    });
  }

  checkLogin() {
    this.fm.checkLogin();
  }
}
