import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OneSignalManager } from '../../providers/onesignal-manager'

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>{{ 'Feedback' | trans }}</ion-title>
      <!--ion-buttons left>
        <button (click)="dismiss()" ion-button icon-only>
          <ion-icon name="md-close" color="danger"></ion-icon>
        </button>
      </ion-buttons-->
      <ion-buttons right>
        <button [disabled] = "!isEnabled" (click)="onSubmit()" text-center ion-button clear color="primary">
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
  `
})
export class FeedbackPage {
  isEnabled: boolean;
  content: string;

  constructor(private navCtrl: NavController, private osm: OneSignalManager) {
    this.isEnabled = false;
  }

  ionViewDidLoad() {
  }

  onValueChange() {
    this.isEnabled = (this.content.trim().length != 0);
  }

  onSubmit() {
    this.osm.sendFeedBack(this.content);
    this.navCtrl.pop();
  }
}
