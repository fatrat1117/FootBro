import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { FirebaseManager } from '../../providers/firebase-manager'
import { OneSignalManager } from '../../providers/onesignal-manager'
import { Localization } from '../../providers/localization';

import { Chat } from './chat.model';
import { CHATS } from './mock-data/mock-chat';

@Injectable()
export class ChatService {
  sizeSubject: Subject<any>;
  currentSize: number;

  constructor(private fm: FirebaseManager, private osm: OneSignalManager, private local: Localization) {
    this.sizeSubject = new Subject();
    this.currentSize = 0;
  }

  getRecentChats(id: string, isUnread: boolean) {
    //this.fm.getChatsWithUser(id, this.sizeSubject).subscribe(chats => {
    //})
    return this.fm.getChatsWithUser(id, this.sizeSubject, isUnread);
    //return Promise.resolve(CHATS);
  }

  getClGroupChats(isUnread: boolean) {
    return this.fm.getClGroupChats(this.sizeSubject, isUnread);
  }

  loadMoreChats() {
    this.currentSize += 10;
    this.sizeSubject.next(this.currentSize)
  }

  sendChat(id: string, pushId: string, content: string) {
    //this.fm.addChatToUser(userId, content);
    this.osm.sendNewChat(id, pushId, content)
  }

  sendClGroupChat(content: string) {
    this.osm.sendClGroupChat(content);
  }

  updateUnread(userId: string, isUnread: boolean) {
    this.fm.updateUnread(userId, isUnread);
  }

  blockUser(userId: string) {
    this.fm.block(userId);
  }

  unblockUser(userId: string) {
    this.fm.unblock(userId);
  }

  isBlockedBy(userId: string) {
    return this.fm.isBlockedBy(userId)
  }

  report(reportId) {
    this.osm.sendFeedBack(reportId + ' : ' + this.local.getString('reportobjectionalbecontent'));
  }
}