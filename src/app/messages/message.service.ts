import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { OneSignalManager } from '../../providers/onesignal-manager';
import { FirebaseManager } from '../../providers/firebase-manager'

import { Message } from './message.model';

@Injectable()
export class MessageService {
  messages: Message[];
  blacklist: string[];
  subscription: any;
  blSubscription: any;
  constructor(private fm: FirebaseManager, private osm : OneSignalManager) {
    this.messages = [];

    document.addEventListener('userlogout', e => {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      if (this.blSubscription) {
        this.blSubscription.unsubscribe();
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
        if (msg.groupName)
          m.groupName = msg.groupName;

        this.messages.push(m);
      })

      this.fm.FireCustomEvent("servicemessageready", unreadCount);
    })
  }

  prepareBlacklist() {
    this. blSubscription = this.fm.getBlackList().subscribe(items => {
      this.blacklist = [];
      items.forEach(i => {
        this.blacklist.push(i.$key);
        if (i.$key == "1")
          this.osm.sendTag("block-cheerleader", "true");
      })
      this.fm.FireEvent("serviceblacklistready");
    })
  }

  getAllMessages() {
    return this.messages;
  }

  getBlackList() {
    return this.blacklist;
  }

  deleteMessage(playerId: string) {
    this.fm.deleteMessage(playerId);
  }
}