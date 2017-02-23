import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { FirebaseManager } from '../../providers/firebase-manager'

import { Message } from './message.model';

@Injectable()
export class MessageService {
  messages: Message[];
  constructor(private fm: FirebaseManager) {
    this.messages = [];
  }

  prepareAllMessages() {
    this.fm.getAllMessages().subscribe(messages => {
      this.messages = [];
      let unreadCount = 0;
      messages.forEach(msg => {
        if (msg.isUnread)
          unreadCount++;

        let m = new Message();
        m.userId = msg.$key;
        m.isUnread = msg.isUnread;
        m.isSystem = msg.isSystem;
        m.lastContent = msg.lastContent;
        m.lastTimestamp = msg.lastTimestamp;
        this.messages.push(m);
      })

      this.fm.FireCustomEvent("servicemessageready", unreadCount);
    })
  }

  getAllMessages() {
    return this.messages;
    //return this.fm.getAllMessages();
  }
}