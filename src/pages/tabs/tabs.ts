import { Component, ViewChild } from '@angular/core';
import { OneSignal, Clipboard } from 'ionic-native';
import { Badge } from '@ionic-native/badge';
import { Tabs, Platform, AlertController, ToastController } from 'ionic-angular';
import { Localization } from '../../providers/localization';
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
    private toastCtrl: ToastController, private local: Localization, private badge: Badge,
    private playerService: PlayerService, private teamService: TeamService, private messageService: MessageService) {

  }

  ionViewDidLoad() {
    this.selfPlayer = null;
    document.addEventListener('userlogin', e => {
      this.tab2Root = MessagesPage;
      this.tab3Root = MePage;
      this.messageService.prepareAllMessages();
    });

    document.addEventListener('userlogout', e => {
      this.tabRef.select(0);
      this.tab2Root = null;
      this.tab3Root = null;
      this.unreadCount = null;

      if (this.selfPlayer == null)
        this.checkClipboard();

      this.selfPlayer = null;
    });

    document.addEventListener('servicemessageready', e => {
      this.unreadCount = e['detail'] > 0 ? e['detail'] : null;
      this.badge.set(this.unreadCount);
    });

    // Start app with login
    document.addEventListener('serviceplayerready', e => {
      if (this.selfPlayer == null && e['detail'] == this.playerService.selfId()) {
        this.selfPlayer = this.playerService.getPlayer(e['detail']);
        this.checkClipboard();
        // setup tags
        if (this.selfPlayer.role == "cheerleader") 
          OneSignal.sendTag("role", "cheerleader");
      }
    });

    document.addEventListener('resume', e => {
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
        //alert('Clipboard Error: ' + reject);
      }
    );
  }

  checkLogin() {
    this.playerService.checkLogin();
  }

  getTeamInfo(msg: string) {
    if (!msg)
      return;
    
    let start = msg.lastIndexOf('(');
    let end = msg.lastIndexOf(')');
    if (start == -1 || end == -1)
    {
      return;
    }

    let ids = "";
    try {
      ids = atob(msg.substring(start + 1, end));
    } catch (error) {
      return;
    }

    let spliter = ids.lastIndexOf("%");
    if (spliter == -1)
    {
      return;
    }

    let playerId = ids.substring(0, spliter);
    let teamId = ids.substring(spliter + 1);

    if (this.selfPlayer && this.selfPlayer.teams && this.selfPlayer.teams.indexOf(teamId) >= 0) // already team member
      return;

    let subscription = this.teamService.getAfPublicTeamName(teamId).subscribe(snapshot => {
      if (snapshot.$value)
        this.showJoinTeamAlert(teamId, snapshot.$value, playerId);
      setTimeout(() => {
        subscription.unsubscribe();
      }, this.fm.unsubscribeTimeout);
    })
  }

  showJoinTeamAlert(teamId: string, teamName: string, invitorId: string) {
    if (this.isAlertOpen)
      return;

    let confirm = this.alertCtrl.create({
      title: this.local.getString("teamInvitation"),
      message: teamName,
      buttons: [
        {
          text: this.local.getString("Cancel"),
          handler: () => {
            Clipboard.copy("");
          }
        },
        {
          text: this.local.getString("join"),
          handler: () => {
            this.confirmJoin(teamId, teamName, invitorId)
            Clipboard.copy("");
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

  confirmJoin(teamId: string, teamName: string, invitorId: string) {
    if (this.playerService.isAuthenticated()) {
      this.teamService.joinTeam(teamId, false);
      if (invitorId)
      {
        this.playerService.earnPoints(invitorId, 10);
        this.osm.notifyInvitationSuccess(invitorId);
      }

      this.toastCtrl.create({
        message: this.local.getString("teamJoinSuccess") + teamName,
        duration: 2000,
        position: 'top'
      }).present();
    }
    else
      this.checkLogin()
  }
}
