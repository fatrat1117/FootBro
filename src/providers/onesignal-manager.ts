import { Injectable } from '@angular/core';
import { OneSignal } from 'ionic-native';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Http, Headers, RequestOptions } from '@angular/http'
import { Platform, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { UIHelper } from '../providers/uihelper'
import { FirebaseManager } from './firebase-manager';
import { PlayerService } from '../app/players/player.service';
import { TeamService } from '../app/teams/team.service';
import { Localization } from '../providers/localization';

@Injectable()
export class OneSignalManager {
  constructor(private platform: Platform, private fm: FirebaseManager, private playerService: PlayerService, private teamService: TeamService, 
    private uiHelper: UIHelper, private http: Http, private local: Localization, private alertController: AlertController) {

  }

  initialize(tabRef) {
    if (this.platform.is('mobileweb') ||
      this.platform.is('core'))
      return;

    OneSignal.startInit('f6268d9c-3503-4696-8e4e-a6cf2c028fc6', '63493717987');

    OneSignal.inFocusDisplaying(OneSignal.OSInFocusDisplayOption.None);

    //OneSignal.handleNotificationReceived().subscribe(() => {
    //console.log("received");
    //});

    OneSignal.handleNotificationOpened().subscribe(() => {
      tabRef.select(2);
      //this.navCtrl.push(MessagesPage);
      //console.log("opened");
      //this.modalCtrl.create(MessagesPage).present();
    });

    OneSignal.endInit();
  }

  postNotification(messageObj, pushIds, success = null) {
    //console.log('postNotification', messageObj, pushIds);

    let notificationObj = {
      heading: { "en": "SoccerBro", "zh-Hans": "绿茵兄弟" },
      contents: messageObj,
      include_player_ids: pushIds,
      ios_badgeType: "Increase",
      ios_badgeCount: 1
    };

    if (window["plugins"] && window["plugins"].OneSignal) {
      window["plugins"].OneSignal.postNotification(notificationObj,
        function (successResponse) {
          //console.log("Notification Post Success:", successResponse);
          if (success)
            success();
        },
        function (failedResponse) {
          console.log("Notification Post Failed: ", failedResponse);
          //alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
        }
      );
    }
  }

  postGroupNotification(messageObj, segmentName, success = null) {
    let notificationObj = {
      app_id: "f6268d9c-3503-4696-8e4e-a6cf2c028fc6",
      heading: { "en": "SoccerBro", "zh-Hans": "绿茵兄弟" },
      contents: messageObj,
      included_segments: [segmentName],
      ios_badgeType: "Increase",
      ios_badgeCount: 1
    };

    // freaking hack starts from here......
    let headers = new Headers({ 
      'Content-Type': 'application/json',
      'Authorization': 'Basic MjkxZWQ0MWYtMDgxYS00ODcxLTkwMTMtNjMzMmQ2MGQ1NDU4'
    });
    let options = new RequestOptions({ headers: headers });

    this.http.post("https://onesignal.com/api/v1/notifications", notificationObj, options).subscribe(data => {
      if (success)
        success();
    }, error => {
      console.log(JSON.stringify(error.json()));
    });
    // end......

    /*
    if (window["plugins"] && window["plugins"].OneSignal) {
      window["plugins"].OneSignal.postNotification(notificationObj,
        function (successResponse) {
          if (success)
            success();
        },
        function (failedResponse) {
          console.log("Notification Post Failed: ", failedResponse);
        }
      );
    }
    */
  }




  
  /****************************** Match ******************************/
  matchNotification_team(type: string /* 'joinMatch' or 'rateMatch' */, teamId: string, matchId: string, enMsg: string = "", chMsg: string = "") {
    let alert = this.alertController.create({
      title: this.local.getString('sending'),
    });
    alert.present();

    let onTeamPlayersReady = e => {
      if (e['detail'] == teamId) {
        let playerIds = [];
        let pushIds = [];
        this.playerService.getTeamPlayers(teamId).forEach(p => {
          if (p.pushId) {
            playerIds.push(p.id);
            pushIds.push(p.pushId);
          }
        })
        document.removeEventListener('serviceteamplayersready', onTeamPlayersReady);
        this.matchNotification(type, matchId, playerIds, pushIds, enMsg, chMsg);
        alert.dismiss();
      }
    }
    document.addEventListener('serviceteamplayersready', onTeamPlayersReady);
    this.playerService.getTeamPlayersAsync(teamId);
  }

  matchNotification(type: string /* 'joinMatch' or 'rateMatch' */, matchId: string, playerIds: string[], pushIds: string[], enMsg: string = "", chMsg: string = "") {
    let message = {
      'en': enMsg != "" ? enMsg : this.local.getString(type + "Detail", 'en'),
      'zh-Hans': chMsg != "" ? chMsg : this.local.getString(type + "Detail", 'zh')
    }
    
    let self = this;
    let success = function (fm: FirebaseManager) {
      let content = {
        'en': message['en'],
        'zh': message['zh-Hans']
      }
      playerIds.forEach(id => {
        self.fm.addChatToUser(id, content, true, {
          type: type,
          detail: matchId
        });
      })
    }

    this.postNotification(message, pushIds, success);
  }







  /****************************** Invitation ******************************/
  notifyInvitationSuccess(invitorId: string) {
    let player = this.playerService.getPlayer(this.playerService.selfId());
    if (!player || !player.name)
      return

    let message = {
      'en': `${player.name} accept your team invitation, you earned 10 points.`,
      'zh-Hans': `${player.name} 接受了你的球队邀请，你获得了10点积分。`
    };

    let onPlayerReady = e => {
      let id = e['detail'];
      if (id == invitorId) {
        let p = this.playerService.getPlayer(id);
        this.postNotification(message, [p.pushId]);
        console.log(p);
      }
      document.removeEventListener('serviceplayerready', onPlayerReady);
    };
    document.addEventListener('serviceplayerready', onPlayerReady);

    this.playerService.getPlayerAsync(invitorId);
  }






  /****************************** Chats ******************************/
  sendNewChat(id: string, pushId: string, content: string) {
    let player = this.playerService.getPlayer(this.playerService.selfId());
    if (!player || !player.name)
      return
    let message = {
      'en': `${player.name} sent you a new message.`,
      'zh-Hans': `${player.name} 向你发送了一条新信息.`
    };

    let self = this;
    let success = function (fm: FirebaseManager) {
      self.fm.addChatToUser(id, content);
    }

    this.postNotification(message, [pushId], success)
  }

  sendClGroupChat(content: string) {
    let player = this.playerService.getPlayer(this.playerService.selfId());
    if (!player || !player.name)
      return

    let message = {
      'en': `${player.name} sent you a new message in Cheerleaders group.`,
      'zh-Hans': `${player.name} 在 拉拉队 群内发送了一条新消息。`
    };

    let self = this;
    let success = function (fm: FirebaseManager) {
      self.fm.addClGroupChat(content);
    }

    this.postGroupNotification(message, "Cheerleaders", success)
  }





  /****************************** Cheerleaders ******************************/
  cheerleaderApproved(id: string, pushId: string) {
    let message = {
      'en': this.local.getString("welcomeCheerleader", 'en'),
      'zh-Hans': this.local.getString("welcomeCheerleader", 'zh')
    };

    let self = this;
    let success = function (fm: FirebaseManager) {
      let content = {
        'en': message['en'],
        'zh': message['zh-Hans']
      }
      self.fm.addChatToUser(id, content, true);
    }

    this.postNotification(message, [pushId], success);
  }

  sendFeedBack(content: string) {
    this.fm.sendFeedback(content);
    let pushIds = [];
    this.playerService.getAdmins().forEach(admin => {
      if (admin.pushId) {
        pushIds.push(admin.pushId);
      }
    });
    let msg = { "en": "You have a new feedback", "zh-Hans": "有新的反馈" };
    this.postNotification(msg, pushIds);

    let self = this;
    //show toast to user
    setTimeout(function () {
      self.uiHelper.presentToast('Thanksforyourfeedback');
    }, 1000);
  }
}