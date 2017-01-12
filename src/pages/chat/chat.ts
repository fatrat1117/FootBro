import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MomentPipe } from '../../pipes/moment.pipe'
import * as moment from 'moment';

import {Localization} from '../../providers/localization';


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
  constructor(private navCtrl: NavController, private navParams: NavParams, private chatService: ChatService, private loacal: Localization) {
  }

  ionViewDidLoad() {
    this.userId = this.navParams.get('userId');

    this.chatService.getRecentChats("0").then(chats => {
      this.chats = chats;
    })
  }

  sendMessage(input) {
    this.chatService.sendChat(this.newMessage);
    this.newMessage = '';
    input.focus();
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
      newTime = new MomentPipe(this.loacal).transform(current);
    }
    else {
      newTime = moment(current).format('HH:mm');
    }
    return newTime;
  }
}
