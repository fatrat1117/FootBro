import { Injectable } from '@angular/core';
import { OneSignal } from 'ionic-native';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Platform } from 'ionic-angular';
import * as firebase from 'firebase';
import { UIHelper } from '../providers/uihelper'
import { FirebaseManager } from './firebase-manager';
import { PlayerService } from '../app/players/player.service';

@Injectable()
export class OneSignalManager {
  constructor(private platform: Platform, private fm: FirebaseManager, private playerService: PlayerService, 
  private uiHelper: UIHelper) {

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
    console.log('postNotification', messageObj, pushIds);

    let notificationObj = {
      heading: { "en": "SoccerBro", "zh-Hans": "绿茵兄弟" },
      contents: messageObj,
      include_player_ids: pushIds,
      ios_badgeType: "Increase",
      ios_badgeCount: 1
    };
    
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
    setTimeout(function() {
      self.uiHelper.presentToast('Thanksforyourfeedback');
    }, 1000);
  }
}