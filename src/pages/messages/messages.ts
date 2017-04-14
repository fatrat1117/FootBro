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
  noRecordId = "messagePageNoRecord";
  noRecordMessage = "";

  constructor(private navCtrl: NavController, private messageService: MessageService, private playerService: PlayerService
  ,private local:Localization) {
  }

  ionViewDidLoad() {
    this.addEventListeners();

    this.messages = this.messageService.getAllMessages();
    this.getPlayerAsync();

    this.noRecordMessage = this.local.getString(this.noRecordId);
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
    
    document.addEventListener('servicemessageready', this.onMessageReady);
    document.addEventListener('serviceplayerready', this.onPlayerReady);

    document.addEventListener('userlogin', e => {
      document.addEventListener('servicemessageready', this.onMessageReady);
      document.addEventListener('serviceplayerready', this.onPlayerReady);
    });

    document.addEventListener('userlogout', e => {
      document.removeEventListener('servicemessageready', this.onMessageReady);
      document.removeEventListener('serviceplayerready', this.onPlayerReady);
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
      user: this.watchListMap[msg.playerId]
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
}
