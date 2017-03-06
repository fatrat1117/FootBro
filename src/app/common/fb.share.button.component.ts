import { Component } from '@angular/core';
import { Screenshot, SocialSharing } from 'ionic-native';

declare var Wechat: any;

@Component({
  selector: 'sb-fb-share-button',
  template: `
  <button ion-fab mini color="light" (click)="onFaceBookClick()">
    <ion-icon name="logo-facebook" color="fBlue"></ion-icon>
  </button>
  `
})

export class SbFbShareButtonComponent {
  constructor() {
  }

  // Facebook
  onFaceBookClick() {
    Screenshot.URI(80).then((res) => {
      //console.log(res);
      SocialSharing.shareViaFacebook(null, res.URI, null)
        .then(() => { },
        err => {
          alert(err);
        });
    }, err => {
      alert(err);
    });
  }
}