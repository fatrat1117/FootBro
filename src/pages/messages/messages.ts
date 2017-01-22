import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ChatPage } from '../chat/chat'
import { Message } from '../../app/messages/shared/message.model'
import { MessageService } from '../../app/messages/shared/message.service'


@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
  providers: [ MessageService ]
})
export class MessagesPage {
  messages: any[];

  constructor(private navCtrl: NavController, private messageService: MessageService) {
  }

  ionViewDidLoad() {
    this.addEventListeners();

    this.messageService.getAllMessages().subscribe(messages => {
      let read = [];
      let unRead = [];
      for (var i = messages.length - 1; i >= 0; --i)
      {
        if (messages[i].isUnread)
          unRead.push(messages[i]);
        else
          read.push(messages[i]);
      }
      this.messages = unRead.concat(read);
    })
  }

  addEventListeners() {
    /*
    document.addEventListener('serviceplayerdataready', e => {
      let playerId = e['detail'];
      //console.log(teamId, this.id);
      if (playerId === this.selfId) {
        console.log("selfId:", this.selfId);
        this.player = this.playerService.getPlayer(playerId);
        console.log(this.player);
        //console.log(this.team);
      }
    });
    */
  }

  markAsRead(slidingItem) {
    slidingItem.close();
  }

  enterChatPage(userId: string, isUnread: boolean) {
    this.navCtrl.push(ChatPage, {
      userId: userId,
      isUnread: isUnread
    });
  }
}
