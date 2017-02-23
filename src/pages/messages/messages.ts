import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ChatPage } from '../chat/chat'
import { Message } from '../../app/messages/message.model'
import { MessageService } from '../../app/messages/message.service'
import { Player } from '../../app/players/player.model';
import { PlayerService } from '../../app/players/player.service';


@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
  messages: Message[];
  watchListMap : {};

  constructor(private navCtrl: NavController, private messageService: MessageService, private playerService: PlayerService) {
  }

  ionViewDidLoad() {
    this.addEventListeners();
    document.addEventListener('servicemessageready', e => {
      this.messages = this.messageService.getAllMessages();
    });

    this.messages = this.messageService.getAllMessages();
    this.getPlayerAsync();
  }

  addEventListeners() {
    document.addEventListener('servicemessageready', e => {
      this.messages = this.messageService.getAllMessages();
      this.getPlayerAsync();
    });

    document.addEventListener('serviceplayerready', e => {
      let playerId = e['detail'];
      if (this.watchListMap[playerId])
      {
        this.watchListMap[playerId] = this.playerService.getPlayer(playerId);
      }
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
}
