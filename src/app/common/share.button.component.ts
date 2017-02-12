import { Component } from '@angular/core';
import { Screenshot, SocialSharing } from 'ionic-native';

declare var Wechat: any;

@Component({
  selector: 'sb-share-button',
  template: `
  <ion-fab bottom right>
    <button ion-fab mini color="light"><ion-icon name="md-share"></ion-icon></button>
    <ion-fab-list side="left">
      <button ion-fab color="light" (click)="onFaceBookClick()">
        <ion-icon name="logo-facebook" color="fBlue"></ion-icon>
      </button>
      <button ion-fab color="light" (click)="onWeChatClick()">
        <img src="assets/icon/wechat.png">
        <!--ion-icon name="logo-twitter" color="wGreen"></ion-icon-->
      </button>
    </ion-fab-list>
  </ion-fab>
  `
})

export class SbShareButtonComponent {
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

  // WeChat
  onWeChatClick() {
    Screenshot.URI(80).then((res) => {
      this.sharePhoto(res.URI);
      console.log(res);
    },
      () => {
        alert('Screenshot failed');
      });
  }

  sharePhoto(picAddress) {
    if (typeof Wechat === "undefined") {
      alert("Wechat plugin is not installed.");
      return false;
    }
    var params = {
      scene: 1//0：对话 1：朋友圈
    };

    params['message'] = {
      title: "绿荫兄弟-图片分享",
      description: "这是图片描述",
      mediaTagName: "媒体标签",
      messageExt: "消息字段",
      messageAction: "<action>dotalist</action>",//消息行为
      media: {}//媒体内容
    };
    params['message'].media.type = Wechat.Type.IMAGE;//媒体类型
    params['message'].media.image = picAddress;//图片文件地址
    //console.log(Wechat, params);

    // 开始分享
    Wechat.share(params, function () {
      alert("Share Success");
    }, function (reason) {
      alert("Share Failed: " + reason);
    });
  }

}