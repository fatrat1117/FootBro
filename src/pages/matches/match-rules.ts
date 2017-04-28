import { Component } from '@angular/core';
import { ViewController, NavParams} from 'ionic-angular';

@Component({
  selector: 'match-rules',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>{{ 'registerRules' | trans }}</ion-title>
      <ion-buttons left>
        <button (click)="dismiss()" ion-button icon-only>
          <ion-icon name="md-close" color="danger"></ion-icon>
        </button>
      </ion-buttons>
    </ion-navbar>
  </ion-header>
  <ion-content>
    <div style="margin: 0.5rem; white-space: pre-line;">
      {{ this.rules }}
    </div>
  </ion-content>
  `
})

export class MatchRulesPage {
  rules = "";

  constructor(private viewCtrl: ViewController, private navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.rules = this.navParams.get("rules");
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}