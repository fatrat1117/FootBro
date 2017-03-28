import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { FirebaseManager } from '../../providers/firebase-manager'

import { Message } from './message.model';

@Injectable()
export class MessageService {
  messages: Message[];
  subscription: any;
  constructor(private fm: FirebaseManager) {
    this.messages = [];

    document.addEventListener('userlogout', e => {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    });
  }

  prepareAllMessages() {
    this.subscription = this.fm.getAllMessages().subscribe(messages => {
      this.messages = [];
      let unreadCount = 0;
      messages.forEach(msg => {
        if (msg.isUnread)
          unreadCount++;

        let m = new Message();
        m.playerId = msg.$key;
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
  }

  deleteMessage(playerId: string) {
    this.fm.deleteMessage(playerId);
  }
}