import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { FirebaseManager } from '../../../providers/firebase-manager'

import { Message } from './message.model';
import { MESSAGES } from './mock-data/mock-message';

@Injectable()
export class MessageService {
  constructor(private fm: FirebaseManager) {
  }

  getAllMessages() {
    return this.fm.getAllMessages();
  }
}