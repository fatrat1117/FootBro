import { NavController } from "ionic-angular";
import { Component, Input, OnInit } from "@angular/core";
import { PlayerRatingUI } from '../../app/players/player.model';
import { Localization } from '../../providers/localization';

@Component({
  selector: 'page-game-rating',
  templateUrl: 'game-rating.html'
})

export class GameRatingPage implements OnInit {
  @Input() players: PlayerRatingUI[];

  constructor(public navCtrl: NavController,
  private loc: Localization) {
  }

  ngOnInit() {
    // if (this.players) {
    //   //console.log(this.players);
    //   for (var i = 0; i < this.players.length; i++) {
    //     //this.modifyEvaluteDataByStar(this.players[i]);
    //     this.modifyStarPictureByStar(this.players[i].starArray, this.players[i].rating);
    //   }
    // }
  }

  getRatingString(rating) {
    if (rating != null) {
      if (rating >= 9) {
        return this.loc.getString('excellent');
      } else if (rating >= 8) {
        return this.loc.getString('verygood');
      } else if (rating >= 7) {
        return this.loc.getString('good');
      } else if (rating >= 6) {
        return this.loc.getString('average');
      } else if (rating >= 5) {
        return this.loc.getString('poor');
      } else if (rating >= 4) {
        return this.loc.getString('verypoor');
      } else {
        return this.loc.getString('extremelypoor');
      }
    }
  }

  getRatingColor(rating) {
    if (rating != null) {
      if (rating >= 9) {
        return "excellent";
      } else if (rating >= 8) {
        return "verygood";
      } else if (rating >= 7) {
        return "good";
      } else if (rating >= 6) {
        return "average";
      } else if (rating >= 5) {
        return "poor";
      } else if (rating >= 4) {
        return "verypoor";
      } else {
        return "extremelypoor";
      }
    }
  }

  //touch事件处理
  onTouchChanged(member, itemId) {
    member.rating = itemId;
    //console.log(itemId);
    for (var i = 0; i < member.starArray.length; i++) {
      if (member.starArray[i].id == itemId + 1) {
        member.starArray[i].src = "ios-star-half";
      } else if (member.starArray[i].id <= itemId) {
        member.starArray[i].src = "ios-star";
      } else {
        member.starArray[i].src = "ios-star-outline";
      }
    }
    member.updateStarPictureByStar();
    //this.modifyEvaluteDataByStar(member);
    //this.modifyStarPictureByStar(member.starArray, member.rating);
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
