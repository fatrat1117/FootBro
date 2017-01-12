import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Chat } from '../../app/chats/shared/chat.model'
import { ChatService } from '../../app/chats/shared/chat.service'

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  providers: [ ChatService ]
})
export class ChatPage {
  chats: Chat[];
  userId: string;
  newMessage: string;
  constructor(private navCtrl: NavController, private navParams: NavParams, private chatService: ChatService) {
  }

  ionViewDidLoad() {
    this.userId = this.navParams.get('userId');

    this.chatService.getRecentChats("0").then(chats => {
      this.chats = chats;
    })
  }
}
