import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Player } from '../../app/players/player.model'
import { PlayerService } from '../../app/players/player.service'
//import { Screenshot, SocialSharing} from 'ionic-native';
//declare var Wechat: any;

import { ChatPage } from '../chat/chat'

@Component({
  selector: 'page-my-player',
  templateUrl: 'my-player.html',
})
export class MyPlayerPage {
  id;
  player = new Player();
  //af
  NumOfLikes: number;
  NumOfUnLikes: number;
  PercentOfLikes: number;
  PercentOfUnLikes: number;

  constructor(private navCtrl: NavController, private service: PlayerService, params: NavParams) {
    this.id = params.get('id');
    
    var fromDBLikes = 213;
    var fromDBUnLikes = 67;
    this.NumOfLikes = fromDBLikes;
    this.NumOfUnLikes = fromDBUnLikes;
    this.PercentOfLikes = fromDBLikes / (fromDBLikes + fromDBUnLikes) * 100;
    this.PercentOfUnLikes = fromDBUnLikes / (fromDBLikes + fromDBUnLikes) * 100;
  }

  ionViewDidLoad() {
    document.addEventListener('serviceplayerready', e => {
      let id = e['detail'];
      if (this.id === id)
        this.player = this.service.getPlayer(id);
    })

    this.service.getPlayerAsync(this.id);
    this.service.increasePopularity(this.id);
  }

/*
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

    // //开始分享
    Wechat.share(params, function () {
      alert("Share Success");
    }, function (reason) {
      alert("Share Failed: " + reason);
    });
  }

  share() {
    Screenshot.save('jpg', 80, 'myscreenshot').then((res) => {
      //console.log(res);
      this.sharePhoto(res.filePath);
    },
      () => {
        alert('Screenshot failed');
      });
  }

  facebookShare() {
      Screenshot.URI(80)
        .then((res) => {
            //console.log(res);
            SocialSharing.shareViaFacebook(null, res.URI, null)
              .then(() => {},
                err => {
                  alert(err);
                });
          },
          err => {
            alert(err);
          });
  }
*/

  enterChatPage() {
    if (this.service.isAuthenticated()) {
      this.navCtrl.push(ChatPage, {
        isSystem: false,
        isUnread: false,
        user: this.player
      })
    }
    else
      this.service.checkLogin();
  }
}
