import { Component } from '@angular/core';
import { PopoverController } from 'ionic-angular';

import { SharePage } from '../../pages/share/share';

declare var Wechat: any;

@Component({
  selector: 'sb-share-button',
  template: `
  <button ion-button icon-only style="background-color: transparent;" (tap)="showSharePage()">
    <ion-icon name="md-share" color="gYellow"></ion-icon>
  </button>
  `
})

export class SbShareButtonComponent {
  constructor(private popoverCtrl: PopoverController) {
  }

  showSharePage() {
    this.popoverCtrl.create(SharePage).present();
  }
}