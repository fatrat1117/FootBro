import { Component } from '@angular/core';
import { ViewController,NavParams } from 'ionic-angular';
import { Screenshot, SocialSharing } from 'ionic-native';

declare var Wechat: any;

@Component({
  selector: 'page-squad-select',
  templateUrl: 'squad-select.html'
})
export class SquadSelectPage {

  squadNumber : Number;
  sampleFiveList:String[] = ["1-1-1-1","1-2-1","2-1-1","1-1-2","2-2-0","2-0-2"];
  sampleSevenList:String[] = ["3-1-2","3-2-1","2-2-2","2-3-1","2-1-3",
  "4-1-1"];
  sampleElevenList:String[] = ["4-4-2","4-5-1","4-3-3","4-2-4","5-3-2",
  "5-4-1"];
  constructor(private viewCtrl: ViewController,private navParams: NavParams) {

  }
  
  ngOnInit() {
    if (this.navParams.data) {
      this.squadNumber = this.navParams.data.select;
      console.log(this.squadNumber);
    }
  }
  
   dismiss() {
    this.viewCtrl.dismiss();
  }

  // Facebook
  onFaceBookClick() {
    this.viewCtrl.dismiss();
    this.viewCtrl.onDidDismiss(() => {
      this.shareToFacebook();
    });
  }

  shareToFacebook() {
    Screenshot.URI(10).then((res) => {
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
  onWeChatClick(type: number) {
    this.viewCtrl.dismiss();
    this.viewCtrl.onDidDismiss(()=> {
      this.shareToWeChat(type);
    });
  }

  shareToWeChat(type: number) {
    this.viewCtrl.dismiss();
    Screenshot.URI(10).then((res) => {
      this.sharePhoto(res.URI, type);
      console.log(res, type);
    },
      () => {
        alert('Screenshot failed');
      });
  }

  sharePhoto(picAddress, type) {
    if (typeof Wechat === "undefined") {
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
      media: {picAddress}
    };
    params['message'].media.type = Wechat.Type.IMAGE;
    params['message'].media.image = picAddress;

    Wechat.share(params, function () {
      alert("Share Success");
    }, function (reason) {
      alert("Share Failed: " + reason);
    });
  }
}
