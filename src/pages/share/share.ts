import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Screenshot, SocialSharing } from 'ionic-native';
import { PlayerService } from '../../app/players/player.service'
import { FirebaseManager } from '../../providers/firebase-manager'

declare var Wechat: any;

@Component({
  selector: 'page-share',
  templateUrl: 'share.html'
})
export class SharePage {
  isWechatInstalled = false;
  sharePoints = 50;
  constructor(private viewCtrl: ViewController,
    private playerService: PlayerService) {
    let self = this;
    if (Wechat) {
      Wechat.isInstalled(function (installed) {
        self.isWechatInstalled = installed;
      }, function (reason) {
        console.log("Failed: " + reason);
      });
    }
  }

  // Facebook
  onFaceBookClick() {
    this.viewCtrl.onDidDismiss(() => {
      this.shareToFacebook();
    });
    this.viewCtrl.dismiss();
  }

  shareToFacebook() {
    let self = this;

    Screenshot.URI(10).then((res) => {
      //console.log(res);
      SocialSharing.shareViaFacebook(null, res.URI, null)
        .then(() => {
          let player = self.playerService.getSelfPlayer();
          if (player && !player.fbShareTime) {
            self.playerService.updateFacebookShareTime();
            self.playerService.earnPoints(self.playerService.selfId(), self.sharePoints);
          }
        },
        err => {
          alert(err);
        });
    }, err => {
      alert(err);
    });
  }


  // WeChat
  onWeChatClick(type: number) {
    this.viewCtrl.onDidDismiss(() => {
      this.shareToWeChat(type);
    });
    this.viewCtrl.dismiss();
  }

  shareToWeChat(type: number) {
    //this.viewCtrl.dismiss();
    Screenshot.URI(10).then((res) => {
      this.sharePhoto(res.URI, type);
      console.log(res, type);
    },
      () => {
        alert('Screenshot failed');
      });
  }

  sharePhoto(picAddress, type) {
    if (typeof Wechat == "undefined") {
      alert("Wechat plugin is not installed.");
      return false;
    }
    var params = {
      scene: type   //0: chats 1: moments
    };

    params['message'] = {
      title: "",
      description: "",
      mediaTagName: "",
      messageExt: "",
      thumb: picAddress,
      messageAction: "<action>Intent.ACTION_SEND</action>",
      media: { picAddress }
    };
    params['message'].media.type = Wechat.Type.IMAGE;
    params['message'].media.image = picAddress;
    let self = this;
    Wechat.share(params, function () {
      console.log("Share Success");
      if (1 === type) {
        let player = self.playerService.getSelfPlayer();
        if (player && !player.wechatShareTime) {
          self.playerService.updateWechatShareTime();
          self.playerService.earnPoints(self.playerService.selfId(), self.sharePoints);
        }
      }
    }, function (reason) {
      console.log("Share Failed: " + reason);
    });
  }
}
