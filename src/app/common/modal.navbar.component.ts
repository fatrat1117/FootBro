import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ViewController} from 'ionic-angular';

@Component({
  selector: 'sb-modal-navbar',
  template: `
  <ion-navbar>
    <ion-title>{{ title | trans }}</ion-title>
    <ion-buttons start showWhen="ios">
      <button (click)="dismiss()" text-center ion-button clear color="light">
        {{ 'Cancel' | trans }}
      </button>
    </ion-buttons>
    <ion-buttons end *ngIf="buttonName">
      <button [disabled] = "!isEnabled" (click)="onFinishClick()" text-center ion-button clear color="primary">
        {{ buttonName | trans }}
      </button>
    </ion-buttons>
  </ion-navbar>
  `
})

export class SbModalNavbarComponent {
  @Input() title: string;
  @Input() buttonName: string
  @Input() isEnabled: boolean;

  @Output() onFinish: EventEmitter<any>;

  constructor(private viewCtrl: ViewController) {
    this.onFinish = new EventEmitter();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onFinishClick() {
    this.onFinish.emit();
  }
}