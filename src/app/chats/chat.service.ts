import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { FirebaseManager } from '../../providers/firebase-manager'
import { OneSignalManager } from '../../providers/onesignal-manager'

import { Chat } from './chat.model';
import { CHATS } from './mock-data/mock-chat';

@Injectable()
export class ChatService {
  sizeSubject: Subject<any>;
  currentSize: number;

  constructor(private fm: FirebaseManager, private osm: OneSignalManager) {
    this.sizeSubject = new Subject();
    this.currentSize = 0;
  }

  getRecentChats(id: string, isUnread: boolean) {
    //this.fm.getChatsWithUser(id, this.sizeSubject).subscribe(chats => {
    //})
    return this.fm.getChatsWithUser(id, this.sizeSubject, isUnread);
    //return Promise.resolve(CHATS);
  }

  loadMoreChats() {
    this.currentSize += 10;
    this.sizeSubject.next(this.currentSize)
  }

  sendChat(id: string, pushId: string, content: string) {
    //this.fm.addChatToUser(userId, content);
    this.osm.sendNewChat(id, pushId, content)
  }

  updateUnread(userId: string, isUnread: boolean) {
    this.fm.updateUnread(userId, isUnread);
  }

}