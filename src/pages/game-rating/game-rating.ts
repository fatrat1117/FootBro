import {NavController} from "ionic-angular";
import {Component, Input} from "@angular/core";
import {PlayerRatingUI} from '../../app/players/player.model';

@Component({
  selector: 'page-game-rating',
  templateUrl: 'game-rating.html'
})

export class GameRatingPage {
  @Input() players : PlayerRatingUI[];

  constructor(public navCtrl: NavController) {
    // for (var i = 0; i < 5; i++) {
    //   this.memberlist[i] = {
    //     name: "梅西" + i,
    //     star: 5 - 0.5 * (i + 1),
    //     evaluteString: i,
    //     evaluteColor: "#00ff00",
    //     starArray: [{
    //       id: 2,
    //       src: "ios-star-outline"
    //     }, {
    //       id: 4,
    //       src: "ios-star-outline"
    //     }, {
    //       id: 6,
    //       src: "ios-star-outline"
    //     }, {
    //       id: 8,
    //       src: "ios-star-outline"
    //     }, {
    //       id: 10,
    //       src: "ios-star-outline"
    //     }]
    //   }
    // }
    // for (var i = 0; i < 5; i++) {
    //   this.modifyEvaluteDataByStar(this.memberlist[i]);
    //   this.modifyStarPictureByStar(this.memberlist[i].starArray, this.memberlist[i].star);
    // }
  }



  //通过star修改评价字符串及评价字颜色
  modifyEvaluteDataByStar(member) {
    if (member.star >= 4.5) {
      member.evaluteString = "非常好";
      member.evaluteColor = "secondary";
    } else if (member.star >= 4) {
      member.evaluteString = "很好";
      member.evaluteColor = "secondary";
    } else if (member.star >= 3.5) {
      member.evaluteString = "好";
      member.evaluteColor = "secondary";
    } else if (member.star >= 3) {
      member.evaluteString = "一般";
      member.evaluteColor = "primary";
    } else if (member.star >= 2.5) {
      member.evaluteString = "差";
      member.evaluteColor = "light";
    } else if (member.star >= 2) {
      member.evaluteString = "很差";
      member.evaluteColor = "light";
    } else {
      member.evaluteString = "非常差";
      member.evaluteColor = "light";
    }
  }

  //通过star修改星星图片
  modifyStarPictureByStar(starArray, star) {
    switch (star) {
      case 0.5:
        starArray[0].src = "ios-star-half";
        break;
      case 1:
        starArray[0].src = "ios-star";
        break;
      case 1.5:
        starArray[0].src = "ios-star";
        starArray[1].src = "ios-star-half";
        break;
      case 2:
        starArray[0].src = "ios-star";
        starArray[1].src = "ios-star";
        break;
      case 2.5:
        starArray[0].src = "ios-star";
        starArray[1].src = "ios-star";
        starArray[2].src = "ios-star-half";
        break;
      case 3:
        starArray[0].src = "ios-star";
        starArray[1].src = "ios-star";
        starArray[2].src = "ios-star";
        break;
      case 3.5:
        starArray[0].src = "ios-star";
        starArray[1].src = "ios-star";
        starArray[2].src = "ios-star";
        starArray[3].src = "ios-star-half";
        break;
      case 4:
        starArray[0].src = "ios-star";
        starArray[1].src = "ios-star";
        starArray[2].src = "ios-star";
        starArray[3].src = "ios-star";
        break;
      case 4.5:
        starArray[0].src = "ios-star";
        starArray[1].src = "ios-star";
        starArray[2].src = "ios-star";
        starArray[3].src = "ios-star";
        starArray[4].src = "ios-star-half";
        break;
      case 5:
        starArray[0].src = "ios-star";
        starArray[1].src = "ios-star";
        starArray[2].src = "ios-star";
        starArray[3].src = "ios-star";
        starArray[4].src = "ios-star";
        break;
    }
  }

  //touch事件处理
  onTouchChanged(member, itemId) {
    member.star = itemId / 2;
    for (var i = 0; i < member.starArray.length; i++) {
      if (member.starArray[i].id == itemId + 1) {
        member.starArray[i].src = "ios-star-half";
      } else if (member.starArray[i].id <= itemId) {
        member.starArray[i].src = "ios-star";
      } else {
        member.starArray[i].src = "ios-star-outline";
      }
    }
    this.modifyEvaluteDataByStar(member);
    this.modifyStarPictureByStar(member.starArray, member.star);
  }
  //星星评分拖动效果的实现函数
  panStar(member, e) {
    var dist = -1;
    if(e.additionalEvent == "panright" || e.additionalEvent == "panleft"){
      dist = e.changedPointers[0].clientX - 70;
    }
    if (dist > -1) {
      var j = parseInt("" + dist) / 12;
      this.onTouchChanged(member, parseInt("" + j));
    }
  }
  //点击星星也能修改评分
  clickStar(member, e) {
    var dist = -1;
    dist = e.clientX - 65;
    if (dist > -1) {
      var j = parseInt("" + dist) / 12+1;
      this.onTouchChanged(member, parseInt("" + j));
    }
  }


  //取消
  openCancel() {
    alert("cancel");
  }

  //确定
  openEnsure() {
    alert("ensure");
  }

}
