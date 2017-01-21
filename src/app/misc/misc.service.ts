import { Injectable } from '@angular/core';
import { FirebaseManager } from '../../providers/firebase-manager';

@Injectable()
export class MiscService {
  teamDataMap = {};

  constructor(private fm: FirebaseManager) {
  };

  sendFeedBack(content: string) {
    this.fm.sendFeedback(content);
  }
}