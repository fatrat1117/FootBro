import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ChatPage } from '../chat/chat'

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage {

  constructor(private navCtrl: NavController) {
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
