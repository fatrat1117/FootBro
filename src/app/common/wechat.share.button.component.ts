import { Component } from '@angular/core';
import { Screenshot, SocialSharing } from 'ionic-native';

declare var Wechat: any;

@Component({
  selector: 'sb-wechat-share-button',
  template: `
  <button ion-fab mini color="light" (click)="onWeChatClick()">
    <img style="max-width: 3rem;" src="assets/icon/wechat.png">
  </button>
  `
})

export class SbWechatShareButtonComponent {
  constructor() {
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
