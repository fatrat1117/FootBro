import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ChatPage } from '../chat/chat'
import { Message } from '../../app/messages/message.model'
import { MessageService } from '../../app/messages/message.service'
import { Player } from '../../app/players/player.model';
import { PlayerService } from '../../app/players/player.service';
import { Localization } from '../../providers/localization';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
  messages: Message[];
  watchListMap : {};
  onMessageReady;
  onPlayerReady;
  onBlacklistReady;
  noRecordId = "messagePageNoRecord";
  noRecordMessage = "";
  blacklist: string[];

  constructor(private navCtrl: NavController, private messageService: MessageService, private playerService: PlayerService
  ,private local:Localization) {
  }

  ionViewDidLoad() {
    this.messageService.prepareBlacklist();
    this.addEventListeners();

    this.messages = this.messageService.getAllMessages();
    this.getPlayerAsync();

    this.noRecordMessage = this.local.getString(this.noRecordId);

    this.blacklist = [];
  }

  addEventListeners() {
    this.onMessageReady = e => {
      this.messages = this.messageService.getAllMessages();
      this.getPlayerAsync();
    };

    this.onPlayerReady = e => {
      let playerId = e['detail'];
      if (this.watchListMap[playerId])
      {
        this.watchListMap[playerId] = this.playerService.getPlayer(playerId);
      }
    };

    this.onBlacklistReady = e => {
      this.blacklist = this.messageService.getBlackList();
    }
        
    document.addEventListener('servicemessageready', this.onMessageReady);
    document.addEventListener('serviceplayerready', this.onPlayerReady);
    document.addEventListener('serviceblacklistready', this.onBlacklistReady);

    document.addEventListener('userlogin', e => {
      this.messageService.prepareBlacklist();
      document.addEventListener('servicemessageready', this.onMessageReady);
      document.addEventListener('serviceplayerready', this.onPlayerReady);
      document.addEventListener('serviceblacklistready', this.onBlacklistReady);
    });

    document.addEventListener('userlogout', e => {
      document.removeEventListener('servicemessageready', this.onMessageReady);
      document.removeEventListener('serviceplayerready', this.onPlayerReady);
      document.removeEventListener('serviceblacklistready', this.onBlacklistReady);
    });
  }

  getPlayerAsync() {
    this.watchListMap = {};
    this.messages.forEach(msg => {
      this.watchListMap[msg.playerId] = {};
      this.playerService.getPlayerAsync(msg.playerId);
    })
  }

  getPlayerInfo(playerId: string) {

    if (playerId)
      return this.watchListMap[playerId];
    else
      return null;
  }

  deleteMessage(playerId: string, slidingItem) {
    slidingItem.close();
    this.messageService.deleteMessage(playerId);
  }

  //enterChatPage(userId: string, isSystem: boolean, isUnread: boolean) {
  enterChatPage(msg: Message) {
    this.navCtrl.push(ChatPage, {
      isSystem: msg.isSystem,
      isUnread: msg.isUnread,
      user: this.watchListMap[msg.playerId],
      isBlocking: this.isUserBlockded(msg.playerId),
      groupName: msg.groupName ? msg.groupName : 'none'
    });
  }

  hasMessage(){
    // return this.chats.length != 0  ? true : false;
    if (typeof this.messages != 'undefined' || this.messages != null){
      if(this.messages.length == 0){
        return false;
      }else{
        return true;
      }
    }else{
      return false;
    }
  }

  isUserBlockded(userId: string) {
    return this.blacklist.indexOf(userId) > -1;
  }

  getLastContent(msg) {
    if (msg.lastContent && msg.lastContent[this.local.langCode]) {
      let str = msg.lastContent[this.local.langCode];
      if (str == "")
        return msg.lastContent;
      else
        return str;
    }
    else
      return msg.lastContent;
  }
}
