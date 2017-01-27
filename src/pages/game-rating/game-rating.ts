/**
 * Created by Administrator on 2017/1/23.
 */
import {NavController} from "ionic-angular";
import {Component, NgModule} from "@angular/core";
@Component({
  selector: 'page-game-rating',
  templateUrl: 'game-rating.html'
})

export class GameRatingPage {
  memberlist = [];

  constructor(public navCtrl: NavController) {

    for (var i = 0; i < 5; i++) {
      this.memberlist[i] = {
        name: "梅西" + i,
        star: 5 - 0.5 * (i + 1),
        evaluteString: i,
        evaluteColor:"#00ff00",
        starArray: [{
          id: 2,
          src: "ios-star-outline"
        }, {
          id: 4,
          src: "ios-star-outline"
        }, {
          id: 6,
          src: "ios-star-outline"
        }, {
          id: 8,
          src: "ios-star-outline"
        }, {
          id: 10,
          src: "ios-star-outline"
        }]
      }
    }
    for (var i = 0; i < 5; i++) {
      this.modifyEvaluteDataByStar(this.memberlist[i]);
      this.modifyStarPictureByStar(this.memberlist[i].starArray,this.memberlist[i].star);
    }
  }

  //mousedown事件处理
  down(member, itemId) {
    this.onTouchChanged(member,itemId);
  }
  //mouseup事件处理
  up(member, itemId) {
    this.onTouchChanged(member,itemId);
  }
  //mouseleave事件处理
  leave(member,itemId){
    this.onTouchChanged(member,itemId);
  }


  //通过star修改评价字符串及评价字颜色
  modifyEvaluteDataByStar(member){
    if (member.star >= 4.5) {
      member.evaluteString= "非常好";
      member.evaluteColor="secondary";
    } else if (member.star >= 4) {
      member.evaluteString="很好";
      member.evaluteColor="secondary";
    } else if (member.star >= 3.5) {
      member.evaluteString= "好";
      member.evaluteColor="secondary";
    } else if (member.star >= 3) {
      member.evaluteString= "一般";
      member.evaluteColor="primary";
    } else if (member.star >= 2.5){
      member.evaluteString= "差";
      member.evaluteColor="light";
    }else if (member.star >= 2){
      member.evaluteString= "很差";
      member.evaluteColor="light";
    }else{
      member.evaluteString= "非常差";
      member.evaluteColor="light";
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
  onTouchChanged(member,itemId){
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
    this.modifyStarPictureByStar(member.starArray,member.star);

  }


  //取消
  openCancel(){
    alert("cancel");
  }
  //确定
  openEnsure(){
    alert("ensure");
  }
}
