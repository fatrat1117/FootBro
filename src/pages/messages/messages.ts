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
    this.messageService.getAllMessages().subscribe(messages => {
      this.messages = [];
      messages.forEach(msg => {
        if (msg.isUnread) {
          this.messages.splice(0, 0, msg);
        }
        else {
          this.messages.push(msg);
        }
      })
    })
  }

  markAsRead(slidingItem) {
    slidingItem.close();
  }

  enterChatPage(userId: string) {
    this.navCtrl.push(ChatPage, {
      userId: userId
    });
  }
}
