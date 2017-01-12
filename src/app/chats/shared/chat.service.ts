import { Injectable } from '@angular/core';

import { Chat } from './chat.model';
import { CHATS } from './mock-data/mock-chat';

@Injectable()
export class ChatService {
  // self
  getRecentChats(id: string): Promise<Chat[]> {
    return Promise.resolve(CHATS);
  }
}