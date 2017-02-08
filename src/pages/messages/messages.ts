import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ChatPage } from '../chat/chat'
import { Message } from '../../app/messages/shared/message.model'
import { MessageService } from '../../app/messages/shared/message.service'
import { Player } from '../../app/players/player.model';
import { PlayerService } from '../../app/players/player.service';


@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
  providers: [ MessageService ]
})
export class MessagesPage {
  messages: any[];
  watchListMap : {};

  constructor(private navCtrl: NavController, private messageService: MessageService, private playerService: PlayerService) {
  }

  ionViewDidLoad() {
    this.addEventListeners();

    this.messageService.getAllMessages().subscribe(messages => {
      this.messages = messages;
      this.watchListMap = {};
      messages.forEach(msg => {
        this.watchListMap[msg.$key] = {};
        this.playerService.getPlayerAsync(msg.$key);
      })
    })

  }

  addEventListeners() {
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
