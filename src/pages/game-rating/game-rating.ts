import { NavController } from "ionic-angular";
import { Component, Input, OnInit } from "@angular/core";
import { PlayerRatingUI } from '../../app/players/player.model';

@Component({
  selector: 'page-game-rating',
  templateUrl: 'game-rating.html'
})

export class GameRatingPage implements OnInit {
  @Input() players: PlayerRatingUI[];

  constructor(public navCtrl: NavController) {
  }

  ngOnInit() {
    if (this.players) {
      //console.log(this.players);
      for (var i = 0; i < this.players.length; i++) {
        //this.modifyEvaluteDataByStar(this.players[i]);
        this.modifyStarPictureByStar(this.players[i].starArray, this.players[i].rating);
      }
    }
  }

  getRatingString(rating) {
    if (rating) {
      if (rating >= 9) {
        return "非常好";
        //member.evaluteColor = "secondary";
      } else if (rating >= 8) {
        return "很好";
        //member.evaluteColor = "secondary";
      } else if (rating >= 7) {
        return "好";
        //member.evaluteColor = "secondary";
      } else if (rating >= 6) {
        return "一般";
        //member.evaluteColor = "primary";
      } else if (rating >= 5) {
        return "差";
        //member.evaluteColor = "light";
      } else if (rating >= 4) {
        return "很差";
        // member.evaluteColor = "light";
      } else {
        return "非常差";
        //member.evaluteColor = "light";
      }
    }
  }

  getRatingColor(rating) {
    if (rating) {
      if (rating >= 9) {
        return "secondary";
      } else if (rating >= 8) {
        return "secondary";
      } else if (rating >= 7) {
        return "secondary";
      } else if (rating >= 6) {
        return "primary";
      } else if (rating >= 5) {
        return "light";
      } else if (rating >= 4) {
        return "light";
      } else {
        return "light";
      }
    }
  }

  //通过star修改星星图片
  modifyStarPictureByStar(starArray, star) {
    console.log(star);
    
    switch (star) {
      case 1:
        starArray[0].src = "ios-star-half";
        break;
      case 2:
        starArray[0].src = "ios-star";
        break;
      case 3:
        starArray[0].src = "ios-star";
        starArray[1].src = "ios-star-half";
        break;
      case 4:
        starArray[0].src = "ios-star";
        starArray[1].src = "ios-star";
        break;
      case 5:
        starArray[0].src = "ios-star";
        starArray[1].src = "ios-star";
        starArray[2].src = "ios-star-half";
        break;
      case 6:
        starArray[0].src = "ios-star";
        starArray[1].src = "ios-star";
        starArray[2].src = "ios-star";
        break;
      case 7:
        starArray[0].src = "ios-star";
        starArray[1].src = "ios-star";
        starArray[2].src = "ios-star";
        starArray[3].src = "ios-star-half";
        break;
      case 8:
        starArray[0].src = "ios-star";
        starArray[1].src = "ios-star";
        starArray[2].src = "ios-star";
        starArray[3].src = "ios-star";
        break;
      case 9:
        starArray[0].src = "ios-star";
        starArray[1].src = "ios-star";
        starArray[2].src = "ios-star";
        starArray[3].src = "ios-star";
        starArray[4].src = "ios-star-half";
        break;
      case 10:
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
    member.rating = itemId;
    for (var i = 0; i < member.starArray.length; i++) {
      if (member.starArray[i].id == itemId + 1) {
        member.starArray[i].src = "ios-star-half";
      } else if (member.starArray[i].id <= itemId) {
        member.starArray[i].src = "ios-star";
      } else {
        member.starArray[i].src = "ios-star-outline";
      }
    }
    //this.modifyEvaluteDataByStar(member);
    this.modifyStarPictureByStar(member.starArray, member.rating);
  }
  //星星评分拖动效果的实现函数
  panStar(member, e) {
    var dist = -1;
    if (e.additionalEvent == "panright" || e.additionalEvent == "panleft") {
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
      var j = parseInt("" + dist) / 12 + 1;
      this.onTouchChanged(member, parseInt("" + j));
    }
  }
}
