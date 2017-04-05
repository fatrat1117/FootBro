import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MiscService } from '../../app/misc/misc.service'


@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>{{ 'Feedback' | trans }}</ion-title>
      <!--ion-buttons left>
        <button (tap)="dismiss()" ion-button icon-only>
          <ion-icon name="md-close" color="danger"></ion-icon>
        </button>
      </ion-buttons-->
      <ion-buttons right>
        <button [disabled] = "!isEnabled" (tap)="onSubmit()" text-center ion-button clear color="primary">
          {{ 'Submit' | trans }}
        </button>
      </ion-buttons>
    </ion-navbar>
  </ion-header>

  <ion-content>
    <ion-item>
      <ion-textarea type="text" rows="6" maxlength="256" [(ngModel)]="content" (ngModelChange)=onValueChange()>
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
