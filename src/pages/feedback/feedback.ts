import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


@Component({
  template: `
  <ion-header>
    <sb-modal-navbar title="Feedback" buttonName="Submit" [isEnabled]="isEnabled" (onFinish)="onSubmit()"></sb-modal-navbar>
  </ion-header>

  <ion-content>
    <ion-item>
      <ion-textarea type="text" rows="6" maxlength="200" [(ngModel)]="content">
      </ion-textarea>
    </ion-item>
  </ion-content>
  `,
  providers: []
})
export class FeedbackPage {
  isEnabled: boolean;
  content: string;

  constructor(private navCtrl: NavController) {
    this.isEnabled = true;
  }

  ionViewDidLoad() {
  }

  onSubmit() {
  }
}
