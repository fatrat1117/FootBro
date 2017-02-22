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
  providers: [ MessageService ]
})
export class MessagesPage {
  messages: Message[];
  watchListMap : {};

  constructor(private navCtrl: NavController, private messageService: MessageService, private playerService: PlayerService) {
  }

  ionViewDidLoad() {
    this.addEventListeners();

    this.messages = this.messageService.getAllMessages();
    console.log(this.messages);
    


/*
    this.messageService.getAllMessages().subscribe(messages => {
      this.messages = messages;
      this.watchListMap = {};
      messages.forEach(msg => {
        this.watchListMap[msg.$key] = {};
        this.playerService.getPlayerAsync(msg.$key);
      })
    })
    */

    document.addEventListener('servicemessageready', e => {
      this.messages = this.messageService.getAllMessages();
    });

  }


  addEventListeners() {
    document.addEventListener('servicemessageready', e => {
      this.messages = this.messageService.getAllMessages();
      this.watchListMap = {};
      this.messages.forEach(msg => {
        this.watchListMap[msg.userId] = {};
        this.playerService.getPlayerAsync(msg.userId);
      })
    });

    document.addEventListener('serviceplayerready', e => {
      let playerId = e['detail'];
      if (this.watchListMap[playerId])
      {
        this.watchListMap[playerId] = this.playerService.getPlayer(playerId);
      }
    });
  }

  getPlayerInfo(playerId: string) {
    return this.watchListMap[playerId];
  }

  markAsRead(slidingItem) {
    slidingItem.close();
  }

  enterChatPage(userId: string, isSystem: boolean, isUnread: boolean) {
    this.navCtrl.push(ChatPage, {
      isSystem: isSystem,
      isUnread: isUnread,
      user: this.watchListMap[userId]
    });
  }
}
