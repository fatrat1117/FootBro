import { Component, Directive, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, AlertController, ModalController } from 'ionic-angular';

import { MatchDetailPage } from '../match-detail/match-detail';

import { MomentPipe } from '../../pipes/moment.pipe'
import * as moment from 'moment';
import { FirebaseListObservable } from 'angularfire2/database';;

import { Localization } from '../../providers/localization';
import { Chat } from '../../app/chats/shared/chat.model'
import { ChatService } from '../../app/chats/chat.service'
import { Player } from '../../app/players/player.model';
import { PlayerService } from '../../app/players/player.service';



@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  providers: [ChatService]
})

/*
@Directive({
  selector: '[keyboardAttach]'
})
*/
export class ChatPage {
  @ViewChild('content') content: Content;
  //chats: FirebaseListObservable<any[]>;
  chats: any[];
  user: Player;
  isSystem: boolean;
  isUnread: boolean;
  newMessage: string;
  isRefreshing: boolean;
  hasChatsMessage = true;
  hasNoChatsMessageId = "chatPageNoRecord";
  hasNoChatsMessage = "";
  blockingMessage: string;
  blockedMessage: string;
  subscription: any;
  blkSubscription: any;
  isBlocking: boolean;
  isBlocked: boolean;
  groupName: string;
  onPlayerReady: any;
  watchListMap : {};

  constructor(private navCtrl: NavController, private navParams: NavParams, 
              private chatService: ChatService, private local: Localization,
              private alertCtrl: AlertController, private playerService: PlayerService,
              private modalController: ModalController) {
  }

  ionViewDidLoad() {
    this.isRefreshing = false;
    this.isBlocked = false;
    //this.content.resize();

    this.isSystem = this.navParams.get('isSystem');
    this.isUnread = this.navParams.get('isUnread');
    this.user = this.navParams.get('user');
    this.isBlocking = this.navParams.get('isBlocking')
    this.groupName = this.navParams.get('groupName');

    this.onPlayerReady = e => {
      let playerId = e['detail'];
      if (this.watchListMap[playerId])
        this.watchListMap[playerId] = this.playerService.getPlayer(playerId);
    };

    /*
    this.onMatchReady = e => {
      let id = e['detail'];
      if (this.todoAction && this.todoAction.detail == id) {
        if (this.todoAction.type == 'joinMatch') {
          this.modalController.create(MatchDetailPage, {
            match: this.matchService.getMatch(id)
          }).present();
        }
        else if (this.todoAction.type == 'rateMatch') {
          this.modalController.create(MatchDetailPage, {
            match: this.matchService.getMatch(id),
            selectedValue: 'players'
          }).present();
        }
        this.todoAction = null;
      }
    }
    */

    if (this.groupName == "cheerleaders") {
      this.subscription = this.chatService.getClGroupChats(this.isUnread).subscribe(chats => {
        this.chats = chats;
        this.hasChatsMessage = this.hasChats();
        this.scrollView();
        this.watchListMap = {};
        document.addEventListener('serviceplayerready', this.onPlayerReady);
        chats.forEach(chat => {
          this.watchListMap[chat.senderId] = {};
          this.playerService.getPlayerAsync(chat.senderId);
        })
      })
    }
    else {
      this.subscription = this.chatService.getRecentChats(this.user.id, this.isUnread).subscribe(chats => {
        this.chats = chats;
        this.hasChatsMessage = this.hasChats();
        this.scrollView();
      })
      this.blkSubscription = this.chatService.isBlockedBy(this.user.id).subscribe(item => {
        this.isBlocked = item.$value;
      })
    }

    this.chatService.loadMoreChats();
    this.hasNoChatsMessage = this.local.getString(this.hasNoChatsMessageId);
    this.blockingMessage = this.local.getString('blockingMsg');
    this.blockedMessage = this.local.getString('blockedMsg');

    //document.addEventListener('servicematchready', this.onMatchReady);
  }

  ionViewWillLeave() {
    this.chatService.updateUnread(this.user.id, false);
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.blkSubscription)
      this.blkSubscription.unsubscribe();
  }

  ionViewWillUnload() {
    document.removeEventListener('serviceplayerready', this.onPlayerReady);
    //document.removeEventListener('servicematchready', this.onMatchReady);
  }

  ionViewDidEnter() {
  }

  scrollView() {
    if (this.content && this.content._scroll) {
      if (this.isRefreshing) {
        setTimeout(_ => this.content.scrollToTop(), 100);
        this.isRefreshing = false;
      }
      else {
        setTimeout(_ => this.content.scrollToBottom(), 100);
      }
    }
  }

  sendMessage(input) {
    if (this.groupName == "cheerleaders")
      this.chatService.sendClGroupChat(this.newMessage);
    else
      this.chatService.sendChat(this.user.id, this.user.pushId, this.newMessage);
    input.focus();
    this.newMessage = '';
    //input.setFocus();
  }

  doRefresh(refresher) {
    this.isRefreshing = true;
    this.chatService.loadMoreChats();
    setTimeout(() => {
      refresher.complete();
    }, 500);
  }

  shouldShowTime(index: number) {
    if (index == 0)
      return true;

    return (this.chats[index].createdAt - this.chats[index - 1].createdAt > 300000);
  }

  getDisplayTime(index: number) {
    var isTheSameDay: boolean;
    var current = this.chats[index].createdAt;
    if (index == 0)
      isTheSameDay = false;
    else if (moment(current).diff(moment(this.chats[index - 1].createdAt), 'days') < 1)
      isTheSameDay = true;
    else
      isTheSameDay = false;

    var newTime: string;
    if (!isTheSameDay) {
      newTime = new MomentPipe(this.local).transform(current);
    }
    else {
      newTime = moment(current).format('HH:mm');
    }

    return newTime;
  }

  hasChats(){
    // return this.chats.length != 0  ? true : false;
      if (typeof this.chats != 'undefined' || this.chats != null){
        if(this.chats.length == 0){
          return false;
        }else{
          return true;
        }
      }else{
        return false;
      }
  }

  block() {
    this.chatService.blockUser(this.user.id)
    this.isBlocking = true;
  }

  unblock() {
    this.chatService.unblockUser(this.user.id)
    this.isBlocking = false;
    this.scrollView();
  }

  onReport() {
    let confirm = this.alertCtrl.create({
      subTitle: this.local.getString('reportobjectionalbecontent'),
      message: this.local.getString('systemadminsdealwithreport'),
      buttons: [
        {
          text: this.local.getString('Cancel'),
          handler: () => {
          }
        },
        {
          text: this.local.getString('OK'),
          handler: () => {
            this.chatService.report(this.user.id);
          }
        }
      ]
    });
    confirm.present();
  }

  isFromSelf(chat) {
    if (chat.isFromSelf)
      return chat.isFromSelf;
    else
      return chat.senderId == this.playerService.selfId();
  }

  getPlayerInfo(playerId: string) {
    if (playerId)
      return this.watchListMap[playerId];
    else
      return null;
  }

  getActionName(type) {
    if (type) {
      return this.local.getString(type);
    }
    return ""
  }

  onSystemClick(action) {
    if (action.detail) {
      let param = {
        matchId: action.detail
      }
      if (action.type == 'rateMatch')
        param['selectedValue'] = 'players';
      this.modalController.create(MatchDetailPage, param).present();
    }
    /*
    switch (action.type) {
      case "joinMatch":
        this.todoAction = action;
        this.matchService.getMatchAsync(action.detail);
        break;
      case "rateMatch":
        this.todoAction = action;
        this.matchService.getMatchAsync(action.detail);
        break;
      default:
        break;
    }
    */
  }

  getSystemChatContent(chat) {
    let str = chat.content[this.local.langCode];
    if (str == "")
      return chat.content;
    else
      return str;
  }
}
