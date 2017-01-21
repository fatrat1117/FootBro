import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MiscService } from '../../app/misc/misc.service'


@Component({
  template: `
  <ion-header>
    <sb-modal-navbar title="Feedback" buttonName="Submit" [isEnabled]="isEnabled" (onFinish)="onSubmit()"></sb-modal-navbar>
  </ion-header>

  <ion-content>
    <ion-item>
      <ion-textarea type="text" rows="6" maxlength="200" [(ngModel)]="content" (ngModelChange)=onValueChange()>
      </ion-textarea>
    </ion-item>
  </ion-content>
  `,
  providers: [ MiscService ]
})
export class FeedbackPage {
  isEnabled: boolean;
  content: string;

  constructor(private navCtrl: NavController, private miscService: MiscService) {
    this.isEnabled = false;
  }

  ionViewDidLoad() {
  }

  onValueChange() {
    this.isEnabled = (this.content.trim().length != 0);
  }

  onSubmit() {
    this.miscService.sendFeedBack(this.content);
    this.navCtrl.pop();
  }
}
