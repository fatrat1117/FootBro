import { Component, ViewChild } from '@angular/core';
import { OneSignal, Clipboard } from 'ionic-native';
import { Tabs, Platform, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RankPage } from '../rank/rank';
import { MatchesPage } from '../matches/matches';
import { MatchListPage } from '../match-list/match-list';
import { MessagesPage } from '../messages/messages';
import { MePage } from '../me/me';
import { FirebaseManager } from '../../providers/firebase-manager';
import { OneSignalManager } from '../../providers/onesignal-manager';

import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'
import { TeamService } from '../../app/teams/team.service'
import { MessageService } from '../../app/messages/message.service'

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  @ViewChild('mainTabs') tabRef: Tabs;

  tab0Root: any = HomePage;
  tab1Root: any = MatchListPage;
  //tab1Root: any = RankPage;
  tab2Root: any = null;
  tab3Root: any = null;

  unreadCount: number;
  isAlertOpen = false;
  selfPlayer: Player;

  constructor(private fm: FirebaseManager, private osm: OneSignalManager, private platform: Platform, private alertCtrl: AlertController, 
              private playerService:PlayerService, private teamService: TeamService, private messageService: MessageService) {

  }

  ionViewDidLoad() {
    this.selfPlayer = null;
    document.addEventListener('userlogin', e => {
      this.tab2Root = MessagesPage;
      this.tab3Root = MePage;
      this.playerService.getPlayerAsync(this.playerService.selfId());
      this.messageService.prepareAllMessages();
      //setTimeout(this.checkClipboard(), 500);
      //this.checkClipboard();
    });

    document.addEventListener('userlogout', e => {
      this.tabRef.select(0);
      this.tab2Root = null;
      this.tab3Root = null;
      this.unreadCount = null;
      this.selfPlayer = null;
    });

    document.addEventListener('servicemessageready', e => {
      this.unreadCount = e['detail'] > 0 ? e['detail'] : null;
    });

    // Start app with login
    document.addEventListener('serviceplayerready', e => {
      if (this.selfPlayer == null && e['detail'] == this.playerService.selfId()) {
        this.selfPlayer = this.playerService.getPlayer(e['detail']);
        this.checkClipboard();
      }
    });

    document.addEventListener('resume', e => {
      this.checkClipboard();
    });

    // Start app without login
    this.platform.ready().then(() => {
      if (!this.playerService.isAuthenticated())
        this.checkClipboard();
    });
  }

  checkClipboard() {
    if (this.platform.is('mobileweb') ||
      this.platform.is('core'))
      return;

    Clipboard.paste().then(
      (resolve: string) => {
        //setTimeout(this.getTeamInfo(resolve), 1000);
        this.getTeamInfo(resolve);
      }, (reject: string) => {
        alert('Error: ' + reject);
      }
    );
  }

  checkLogin() {
    this.playerService.checkLogin();
  }

  getTeamInfo(msg: string) {
    let start = msg.lastIndexOf('(');
    let end = msg.lastIndexOf(')');
    if (start == -1 || end == -1)
      return;

    let teamId = msg.substring(start + 1, end);
    if (this.selfPlayer && this.selfPlayer.teams.indexOf(teamId) >=0) // already team member
      return;

    this.teamService.getAfPublicTeamName(teamId).subscribe(snapshot => {
      if (snapshot.$value)
        this.showJoinTeamAlert(teamId, snapshot.$value)
    }).unsubscribe();
  }

  showJoinTeamAlert(teamId: string, teamName: string) {
    if (this.isAlertOpen)
      return;

    let confirm = this.alertCtrl.create({
      title: `Team invitation from`,
      subTitle: teamName,
      buttons: [
        {
          text: 'Join',
          handler: () => {
            this.confirmJoin(teamId)
          }
        },
        {
          text: 'Cancel',
          handler: () => {
          }
        }
      ]
    });
    confirm.onDidDismiss(() => {
      this.isAlertOpen = false;
    });
    confirm.present();
    this.isAlertOpen = true;
  }

  confirmJoin(teamId: string) {
    if (this.playerService.isAuthenticated()) {
      this.teamService.joinTeam(teamId, false);
    }
    else
      this.checkLogin()
  }
}
